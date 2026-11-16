import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-west-2" });

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const JOB_DURATION = 60 * 60 * 1000;

function getArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function clean(value) {
  return value == null
    ? ""
    : String(value)
        .replace(/\u00a0/g, " ")
        .trim();
}

function normalizePostcode(value) {
  return clean(value).toUpperCase().replace(/\s+/g, "");
}

function extractPostcode(value) {
  const match = clean(value).match(
    /(?:^|[^A-Z0-9])(GIR\s*0AA|[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})(?=$|[^A-Z0-9])/i
  );

  return match ? normalizePostcode(match[1]) : "";
}

function normalizeAddress(value) {
  const postcode = extractPostcode(value);

  let address = clean(value).toLowerCase();

  if (postcode) {
    const postcodePattern = `${postcode.slice(0, -3)}\\s*${postcode.slice(-3)}`;

    address = address.replace(new RegExp(postcodePattern, "ig"), " ");
  }

  return address
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(united kingdom|england|london)\b/g, " ")
    .replace(/\broad\b/g, "rd")
    .replace(/\bstreet\b/g, "st")
    .replace(/\bavenue\b/g, "ave")
    .replace(/\bgardens\b/g, "gdns")
    .replace(/\bclose\b/g, "cl")
    .replace(/\bdrive\b/g, "dr")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(value) {
  let year;
  let month;
  let day;

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);

    if (!parsed) return null;

    year = parsed.y;
    month = parsed.m;
    day = parsed.d;
  } else if (value instanceof Date) {
    year = value.getFullYear();
    month = value.getMonth() + 1;
    day = value.getDate();
  } else {
    const match = clean(value).match(
      /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/
    );

    if (!match) return null;

    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);

    if (year < 100) year += 2000;
  }

  const test = new Date(Date.UTC(year, month - 1, day));

  if (
    year !== 2024 ||
    test.getUTCFullYear() !== year ||
    test.getUTCMonth() + 1 !== month ||
    test.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function parseTime(value) {
  if (typeof value === "number" && value >= 0 && value < 1) {
    const minutes = Math.round(value * 1440);

    if (minutes >= 1440) return null;

    return {
      hour: Math.floor(minutes / 60),
      minute: minutes % 60,
    };
  }

  const match = clean(value).match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);

  if (match[3]) {
    if (hour < 1 || hour > 12) return null;

    hour = (hour % 12) + (match[3].toLowerCase() === "pm" ? 12 : 0);
  }

  if (hour > 23 || minute > 59) return null;

  return { hour, minute };
}

function toTimestamp(date, time) {
  const guess = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    time.hour,
    time.minute
  );

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  function matches(timestamp) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(timestamp))
        .map(({ type, value }) => [type, value])
    );

    return (
      Number(parts.year) === date.year &&
      Number(parts.month) === date.month &&
      Number(parts.day) === date.day &&
      Number(parts.hour) === time.hour &&
      Number(parts.minute) === time.minute
    );
  }

  const candidates = [guess, guess - 3600000].filter(matches);

  return candidates.length === 1 ? candidates[0] : null;
}

function getItemValue(item, attribute) {
  return item?.[attribute]?.S ?? item?.[attribute]?.N ?? "";
}

function escapeCsv(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

async function listItems() {
  const items = [];
  let exclusiveStartKey;

  do {
    const params = {
      TableName: TABLE_NAME,
      ConsistentRead: true,
      ...(exclusiveStartKey ? { ExclusiveStartKey: exclusiveStartKey } : {}),
    };

    const command = new ScanCommand(params);
    const data = await client.send(command);

    items.push(...(data.Items ?? []));
    exclusiveStartKey = data.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}

function extractJobs(fileName) {
  const workbook = XLSX.readFile(fileName, {
    cellDates: false,
  });

  const jobs = [];

  for (const month of MONTHS) {
    const sheet = workbook.Sheets[month];

    if (!sheet) {
      throw new Error(`Missing worksheet: ${month}`);
    }

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
      blankrows: true,
    });

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (const offset of [0, 6]) {
        const [rawDate, rawTime, rawAddress, rawPrice, paidBy] = (
          rows[rowIndex] ?? []
        ).slice(offset, offset + 5);

        const address = clean(rawAddress);

        if (
          !address ||
          /^(address|total|total week|week\s*\d)/i.test(address) ||
          clean(rawDate).toLowerCase() === "date" ||
          clean(rawTime).toLowerCase() === "time"
        ) {
          continue;
        }

        const date = parseDate(rawDate);
        const time = parseTime(rawTime);

        const start = date && time ? toTimestamp(date, time) : null;

        const priceText = clean(rawPrice).replace(/[£,\s]/g, "");

        const price =
          priceText !== "" && /^\d+(?:\.\d+)?$/.test(priceText)
            ? Number(priceText)
            : null;

        jobs.push({
          month,
          excelRow: rowIndex + 1,
          block: offset === 0 ? "A:E" : "G:K",
          rawDate: clean(rawDate),
          rawTime: clean(rawTime),
          address,
          postcode: extractPostcode(address),
          normalizedAddress: normalizeAddress(address),
          price,
          paidBy: clean(paidBy),
          date: date
            ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(
                date.day
              ).padStart(2, "0")}`
            : "",
          time: time
            ? `${String(time.hour).padStart(2, "0")}:${String(
                time.minute
              ).padStart(2, "0")}`
            : "",
          start,
          end: start === null ? null : start + JOB_DURATION,
        });
      }
    }
  }

  return jobs;
}

function organizeItems(items) {
  const customers = new Map();
  const addresses = [];
  const jobs = [];

  for (const item of items) {
    const pk = getItemValue(item, "PK");
    const sk = getItemValue(item, "SK");

    if (!pk.startsWith("customer_")) continue;

    const customerId = pk.replace("customer_", "");

    if (sk === "profile" && getItemValue(item, "status") !== "deleted") {
      customers.set(customerId, item);
    }

    if (
      sk.startsWith("address_") &&
      getItemValue(item, "status") === "active"
    ) {
      const address = getItemValue(item, "address");
      const postcode = getItemValue(item, "postcode");

      addresses.push({
        customerId,
        addressId: sk.replace("address_", ""),
        address,
        postcode,
        normalizedPostcode: normalizePostcode(postcode),
        normalizedAddress: normalizeAddress(address),
      });
    }

    if (sk.startsWith("job_")) {
      jobs.push({
        customerId,
        addressId: getItemValue(item, "address_id"),
        start: Number(getItemValue(item, "start")),
      });
    }
  }

  return { customers, addresses, jobs };
}

function analyseJobs(excelJobs, database) {
  const results = [];
  const seenJobs = new Set();

  for (const job of excelJobs) {
    let status = "REVIEW";
    let reason = "";
    let customerId = "";
    let addressId = "";
    let matchedAddress = "";

    const addressMatches = database.addresses.filter(
      (address) =>
        address.normalizedAddress === job.normalizedAddress &&
        address.normalizedAddress &&
        (!job.postcode || address.normalizedPostcode === job.postcode)
    );

    const postcodeMatches = job.postcode
      ? database.addresses.filter(
          (address) => address.normalizedPostcode === job.postcode
        )
      : [];

    if (addressMatches.length === 1) {
      const match = addressMatches[0];

      customerId = match.customerId;
      addressId = match.addressId;
      matchedAddress = `${match.address}, ${match.postcode}`;
    }

    if (!job.date) {
      reason = "INVALID_OR_MISSING_DATE";
    } else if (!job.time || job.start === null) {
      reason = "INVALID_OR_MISSING_TIME";
    } else if (job.price === null) {
      reason = "INVALID_OR_MISSING_PRICE";
    } else if (!job.normalizedAddress) {
      reason = "INVALID_ADDRESS";
    } else if (addressMatches.length > 1) {
      reason = "AMBIGUOUS_ADDRESS";
    } else if (
      job.postcode &&
      addressMatches.length === 1 &&
      database.customers.has(customerId)
    ) {
      status = "MATCH";
      reason = "EXACT_ADDRESS_AND_POSTCODE";
    } else if (addressMatches.length === 1) {
      reason = job.postcode
        ? "CUSTOMER_NOT_FOUND"
        : "ADDRESS_MATCH_WITHOUT_POSTCODE";
    } else if (postcodeMatches.length > 0) {
      reason = "POSTCODE_MATCH_ONLY";
    } else {
      status = "NO_MATCH";
      reason = "NO_ADDRESS_MATCH";
    }

    const fingerprint = [
      job.date,
      job.time,
      job.normalizedAddress,
      job.postcode,
      job.price,
    ].join("|");

    if (seenJobs.has(fingerprint)) {
      status = "REVIEW";
      reason = "POSSIBLE_DUPLICATE_IN_EXCEL";
    }

    seenJobs.add(fingerprint);

    const existingJob = database.jobs.some(
      (item) =>
        item.customerId === customerId &&
        item.addressId === addressId &&
        item.start === job.start
    );

    if (customerId && job.start !== null && existingJob) {
      status = "REVIEW";
      reason = "JOB_ALREADY_EXISTS_IN_DEV";
    }

    results.push({
      ...job,
      status,
      reason,
      customerId,
      addressId,
      matchedAddress,
      candidateCount: addressMatches.length || postcodeMatches.length,
    });
  }

  return results;
}

function createReport(results, outputFile) {
  const headers = [
    "status",
    "reason",
    "month",
    "excelRow",
    "block",
    "rawDate",
    "rawTime",
    "date",
    "time",
    "start",
    "end",
    "address",
    "postcode",
    "price",
    "paidBy",
    "customerId",
    "addressId",
    "matchedAddress",
    "candidateCount",
  ];

  const rows = results.map((job) => [
    job.status,
    job.reason,
    job.month,
    job.excelRow,
    job.block,
    job.rawDate,
    job.rawTime,
    job.date,
    job.time,
    job.start ?? "",
    job.end ?? "",
    job.address,
    job.postcode,
    job.price ?? "",
    job.paidBy,
    job.customerId,
    job.addressId,
    job.matchedAddress,
    job.candidateCount,
  ]);

  const content = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  fs.writeFileSync(outputFile, `\uFEFF${content}\n`);
}

(async () => {
  try {
    if (
      !TABLE_NAME ||
      TABLE_NAME !== "wcleaner-dev" ||
      (process.env.ENV && process.env.ENV.toLowerCase() !== "dev")
    ) {
      throw new Error("Safety check failed: TABLE_NAME must be wcleaner-dev.");
    }

    if (
      process.argv.some((arg) =>
        ["--apply", "--write", "--confirm-dev"].includes(arg)
      )
    ) {
      throw new Error("This script is READ-ONLY.");
    }

    const fileName = getArgument("--file");

    if (!fileName || !fs.existsSync(fileName)) {
      throw new Error('Excel file not found. Use --file "Booking 2024.xlsx"');
    }

    const outputFile =
      getArgument("--output") ||
      path.resolve(`jobs-2024-analysis-${Date.now()}.csv`);

    console.log("Reading Excel Jobs...");
    const excelJobs = extractJobs(fileName);

    console.log(`Found ${excelJobs.length} job candidates.`);

    console.log("Scanning DEV database...");
    const items = await listItems();

    const database = organizeItems(items);

    console.log(`Customers: ${database.customers.size}`);
    console.log(`Cleaning Addresses: ${database.addresses.length}`);
    console.log(`Existing Jobs: ${database.jobs.length}`);

    console.log("Analysing address matches...");
    const results = analyseJobs(excelJobs, database);

    createReport(results, outputFile);

    console.log("");
    console.log("=== JOB MIGRATION ANALYSIS ===");
    console.log(`Total: ${results.length}`);

    for (const status of ["MATCH", "REVIEW", "NO_MATCH"]) {
      const count = results.filter((job) => job.status === status).length;

      console.log(`${status}: ${count}`);
    }

    console.log(`Report: ${outputFile}`);
    console.log("DRY RUN: No data was written to DynamoDB.");
  } catch (error) {
    console.error("Internal Error", error);
    process.exitCode = 1;
  }
})();
