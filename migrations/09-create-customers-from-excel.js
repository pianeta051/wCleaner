import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import * as uuid from "uuid";
import {
  DynamoDBClient,
  ScanCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "wcleaner-dev";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : args[i + 1];
};

const apply = args.includes("--apply");
const file = arg("--file");

if (!file || !fs.existsSync(file)) {
  throw new Error("Indica --file <archivo.xlsx>");
}

if (apply && !args.includes("--confirm-dev")) {
  throw new Error("Para escribir en DEV necesitas --apply --confirm-dev");
}

if (process.env.ENV && process.env.ENV.toLowerCase() !== "dev") {
  throw new Error("ENV debe ser dev o estar vacío");
}

const clean = (v) => (v == null ? "" : String(v).trim());
const emailKey = (v) => clean(v).toLowerCase();

function phoneKey(value) {
  let p = clean(value).replace(/[^\d+]/g, "");

  if (!p) return "";

  if (p.startsWith("00")) {
    p = "+" + p.slice(2);
  }

  if (p.startsWith("+44")) {
    p = "0" + p.slice(3);
  } else if (p.startsWith("44") && !p.startsWith("440")) {
    p = "0" + p.slice(2);
  } else if (p.startsWith("+")) {
    return p;
  }

  return p;
}

function postcodeValid(p) {
  return /^[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}$/i.test(p);
}

function postcodeValue(v) {
  const p = clean(v).toUpperCase().replace(/\s+/g, "");
  return p.length > 3 ? `${p.slice(0, -3)} ${p.slice(-3)}` : p;
}

function slugBase(email, name) {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .join("-");

  const emailSlug = email ? email.split("@")[0].toLowerCase() : "";

  return emailSlug.length ? emailSlug : nameSlug;
}

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csv(rows) {
  const keys = [
    "excelRow",
    "decision",
    "reason",
    "name",
    "address",
    "postcode",
    "mainTelephone",
    "secondTelephone",
    "email",
    "matches",
    "slug",
  ];

  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => csvCell(r[k])).join(",")),
  ].join("\n");
}

async function scanCustomers(client) {
  const all = [];
  let ExclusiveStartKey;

  do {
    const response = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ConsistentRead: true,
        ProjectionExpression:
          "PK, SK, #n, email, mainTelephone, secondTelephone, slug",
        ExpressionAttributeNames: {
          "#n": "name",
        },
        FilterExpression: "begins_with(PK, :prefix) AND SK = :profile",
        ExpressionAttributeValues: {
          ":prefix": { S: "customer_" },
          ":profile": { S: "profile" },
        },
        ...(ExclusiveStartKey ? { ExclusiveStartKey } : {}),
      })
    );

    all.push(...(response.Items || []));
    ExclusiveStartKey = response.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return all;
}

function indexAdd(map, key, entry) {
  if (!key) return;

  if (!map.has(key)) {
    map.set(key, []);
  }

  map.get(key).push(entry);
}

function contacts(row) {
  return [
    ...[row.mainTelephone, row.secondTelephone]
      .map(phoneKey)
      .filter(Boolean)
      .map((v) => `p:${v}`),
    ...(row.email ? [`e:${emailKey(row.email)}`] : []),
  ];
}

function makeProfile(r, id, slug) {
  const outcode = r.postcode.split(" ")[0];

  const item = {
    PK: { S: `customer_${id}` },
    SK: { S: "profile" },

    name: { S: r.name },
    name_lowercase: { S: r.name.toLowerCase() },

    address: { S: r.address },
    address_lowercase: { S: r.address.toLowerCase() },

    postcode: { S: r.postcode },
    postcode_lowercase: { S: r.postcode.toLowerCase() },

    outcode: { S: outcode.toUpperCase() },

    mainTelephone: { S: r.mainTelephone },
    secondTelephone: { S: r.secondTelephone },

    slug: { S: slug },
    status: { S: "active" },
  };

  if (r.email) {
    item.email = { S: r.email };
    item.email_lowercase = {
      S: r.email.toLowerCase(),
    };
  }

  return item;
}

function makeAddress(r, id, addressId) {
  return {
    PK: { S: `customer_${id}` },
    SK: { S: `address_${addressId}` },

    name: { S: "Home" },
    address: { S: r.address },
    postcode: { S: r.postcode },
    outcode: { S: r.postcode.split(" ")[0] },

    status: { S: "active" },
  };
}

async function main() {
  const client = new DynamoDBClient({
    region: "eu-west-2",
  });

  const book = XLSX.readFile(file, {
    cellDates: false,
  });

  const sheet = book.Sheets[book.SheetNames[0]];

  const input = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
    blankrows: false,
  });

  const rows = input.map((r, i) => ({
    excelRow: i + 2,

    name: clean(r.Name),
    address: clean(r.Address),
    postcode: postcodeValue(r.Postcode),

    mainTelephone: clean(r.Telephone),
    secondTelephone: clean(r["Telephone 2"]),
    email: clean(r.email),

    decision: "CREATE",
    reason: "",
    matches: "",
    slug: "",
  }));

  const existing = await scanCustomers(client);
  const existingIndex = new Map();
  const existingSlugs = new Set();

  for (const item of existing) {
    const ref = `${item.PK?.S || ""} (${item.name?.S || ""})`;

    const record = {
      mainTelephone: item.mainTelephone?.S || "",
      secondTelephone: item.secondTelephone?.S || "",
      email: item.email?.S || "",
    };

    for (const key of new Set(contacts(record))) {
      indexAdd(existingIndex, key, ref);
    }

    if (item.slug?.S) {
      existingSlugs.add(item.slug.S);
    }
  }

  // Detectar duplicados dentro del propio Excel
  const excelIndex = new Map();

  rows.forEach((r) => {
    for (const key of new Set(contacts(r))) {
      indexAdd(excelIndex, key, r.excelRow);
    }
  });

  const reservedSlugs = new Set(existingSlugs);

  // Clasificar cada fila
  for (const r of rows) {
    const reasons = [];
    const matches = [];

    if (!r.name || !r.address || !r.postcode) {
      reasons.push("Campos obligatorios incompletos");
    }

    if (r.postcode && !postcodeValid(r.postcode)) {
      reasons.push("Postcode inválido");
    }

    if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
      reasons.push("Email inválido");
    }

    for (const key of new Set(contacts(r))) {
      for (const ref of existingIndex.get(key) || []) {
        matches.push(`DEV ${ref} [${key}]`);
      }

      for (const rowNum of excelIndex.get(key) || []) {
        if (rowNum !== r.excelRow) {
          matches.push(`Excel fila ${rowNum} [${key}]`);
        }
      }
    }

    if (matches.length) {
      reasons.push("Coincidencia de teléfono/email");
    }

    r.matches = [...new Set(matches)].join(" | ");

    if (reasons.length) {
      r.decision = "REVIEW";
      r.reason = reasons.join("; ");
      continue;
    }

    const base = slugBase(r.email, r.name);

    if (!base) {
      r.decision = "REVIEW";
      r.reason = "Slug vacío";
      continue;
    }

    let slug = base;
    let counter = 2;

    while (reservedSlugs.has(slug)) {
      slug = `${base}-${counter++}`;
    }

    r.slug = slug;
    reservedSlugs.add(slug);
  }

  // Generar informe CSV
  const output = path.resolve(`migration-dev-report-${Date.now()}.csv`);

  fs.writeFileSync(output, "\uFEFF" + csv(rows), "utf8");

  const creates = rows.filter((r) => r.decision === "CREATE");
  const reviews = rows.filter((r) => r.decision === "REVIEW");

  console.log(
    `Tabla: ${TABLE_NAME}; ` +
      `Excel: ${rows.length}; ` +
      `DEV existentes: ${existing.length}; ` +
      `CREATE: ${creates.length}; ` +
      `REVIEW: ${reviews.length}`
  );

  console.log(`Informe: ${output}`);

  // Modo seguro: no escribir nada
  if (!apply) {
    console.log("DRY RUN: no se ha escrito nada en DynamoDB.");
    return;
  }

  if (reviews.length) {
    console.log("Hay registros REVIEW. Se importarán solamente los CREATE.");
  }

  // Registro de transacciones confirmadas
  const auditPath = path.resolve(`migration-dev-import-${Date.now()}.csv`);

  fs.writeFileSync(auditPath, "excelRow,customerId,name,slug,status\n", "utf8");

  console.log(`Registro de importación: ${auditPath}`);

  // Comprobar duplicados y slugs existentes en DEV
  const checkConflicts = async (r) => {
    const latest = await scanCustomers(client);
    const latestContacts = new Set();
    const latestSlugs = new Set();

    for (const item of latest) {
      for (const key of contacts({
        mainTelephone: item.mainTelephone?.S || "",
        secondTelephone: item.secondTelephone?.S || "",
        email: item.email?.S || "",
      })) {
        latestContacts.add(key);
      }

      if (item.slug?.S) {
        latestSlugs.add(item.slug.S);
      }
    }

    return (
      contacts(r).some((key) => latestContacts.has(key)) ||
      latestSlugs.has(r.slug)
    );
  };

  // Primera comprobación antes de escribir
  const latest = await scanCustomers(client);
  const latestContacts = new Set();
  const latestSlugs = new Set();

  for (const item of latest) {
    for (const key of contacts({
      mainTelephone: item.mainTelephone?.S || "",
      secondTelephone: item.secondTelephone?.S || "",
      email: item.email?.S || "",
    })) {
      latestContacts.add(key);
    }

    if (item.slug?.S) {
      latestSlugs.add(item.slug.S);
    }
  }

  if (
    creates.some(
      (r) =>
        contacts(r).some((key) => latestContacts.has(key)) ||
        latestSlugs.has(r.slug)
    )
  ) {
    throw new Error(
      "DEV ha cambiado desde el análisis. Importación cancelada."
    );
  }

  // Importar cada Customer con su dirección Home
  let done = 0;

  for (const r of creates) {
    // Revalidar justo antes de escribir
    if (await checkConflicts(r)) {
      throw new Error(
        `Conflicto detectado en fila ${r.excelRow} (${r.name}). ` +
          `Importación detenida tras ${done} clientes. ` +
          `Registro: ${auditPath}`
      );
    }

    const id = uuid.v1();
    const addressId = uuid.v1();

    try {
      await client.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Put: {
                TableName: TABLE_NAME,
                Item: makeProfile(r, id, r.slug),
                ConditionExpression:
                  "attribute_not_exists(PK) AND attribute_not_exists(SK)",
              },
            },
            {
              Put: {
                TableName: TABLE_NAME,
                Item: makeAddress(r, id, addressId),
                ConditionExpression:
                  "attribute_not_exists(PK) AND attribute_not_exists(SK)",
              },
            },
          ],
        })
      );
    } catch (error) {
      console.error(
        `Detenido en fila ${r.excelRow}. ` +
          `Confirmados: ${done}. Registro: ${auditPath}`
      );
      throw error;
    }

    // Registrar únicamente después de confirmar la transacción
    fs.appendFileSync(
      auditPath,
      [r.excelRow, id, csvCell(r.name), csvCell(r.slug), "CREATED"].join(",") +
        "\n",
      "utf8"
    );

    done++;

    console.log(
      `CREATED ${done}/${creates.length}: ` + `fila ${r.excelRow} ${r.name}`
    );
  }

  console.log(
    `Finalizado: ${done} clientes y ` +
      `${done} direcciones Home creados en DEV.`
  );

  console.log(`Registro: ${auditPath}`);
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exitCode = 1;
});
