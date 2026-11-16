import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const TABLE_NAME = "wcleaner-dev";
const AWS_REGION = "eu-west-2";

if (process.env.ENV && process.env.ENV.toLowerCase() !== "dev") {
  throw new Error("Safety check failed: ENV must be dev or unset.");
}

const args = process.argv.slice(2);

if (
  args.some((argument) =>
    ["--apply", "--confirm-dev", "--write"].includes(argument)
  )
) {
  throw new Error("This script is strictly READ-ONLY.");
}

function getArgument(name) {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

const excelFile = getArgument("--file");

if (!excelFile || !fs.existsSync(excelFile)) {
  throw new Error('Usage: --file "Booking 2024.xlsx"');
}

const outputFile =
  getArgument("--output") ||
  path.resolve(`jobs-2024-analysis-${Date.now()}.csv`);

const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
});

// --------------------------------------------------
// Text and address normalization
// --------------------------------------------------

function clean(value) {
  return value == null
    ? ""
    : String(value)
        .replace(/\u00a0/g, " ")
        .trim();
}

function normalizeText(value) {
  return clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:united kingdom|uk|england|london)\b/g, " ")
    .replace(/\broad\b/g, "rd")
    .replace(/\bstreet\b/g, "st")
    .replace(/\bavenue\b/g, "ave")
    .replace(/\bgardens\b/g, "gdns")
    .replace(/\bclose\b/g, "cl")
    .replace(/\bdrive\b/g, "dr")
    .replace(/\bflat\b/g, "flat")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePostcode(value) {
  return clean(value).toUpperCase().replace(/\s+/g, "");
}

const UK_POSTCODE_REGEX =
  /\b(GIR\s*0AA|(?:[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}))\b/i;

function extractPostcode(value) {
  const match = clean(value).toUpperCase().match(UK_POSTCODE_REGEX);

  return match ? normalizePostcode(match[0]) : "";
}

function normalizeStreet(address, postcode = "") {
  let normalizedAddress = clean(address);

  const embeddedPostcode = extractPostcode(normalizedAddress);

  for (const candidate of [postcode, embeddedPostcode].filter(Boolean)) {
    const compactPostcode = normalizePostcode(candidate);

    if (compactPostcode.length > 3) {
      const formattedPostcode =
        `${compactPostcode.slice(0, -3)}\\s*` + compactPostcode.slice(-3);

      normalizedAddress = normalizedAddress.replace(
        new RegExp(`\\b${formattedPostcode}\\b`, "ig"),
        " "
      );
    }
  }

  return normalizeText(normalizedAddress);
}

function escapeCsv(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function getDynamoValue(item, key) {
  return item?.[key]?.S ?? item?.[key]?.N ?? "";
}

// --------------------------------------------------
// Excel date parsing
// --------------------------------------------------

function parseExcelDate(value) {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 40000 &&
    value <= 60000
  ) {
    const date = XLSX.SSF.parse_date_code(value);

    if (date && date.y === 2024) {
      return {
        year: date.y,
        month: date.m,
        day: date.d,
      };
    }

    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    if (value.getFullYear() !== 2024) {
      return null;
    }

    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    };
  }

  const match = clean(value).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const shortYear = Number(match[3]);
  const year = shortYear < 100 ? 2000 + shortYear : shortYear;

  const testDate = new Date(Date.UTC(year, month - 1, day));

  const isValid =
    year === 2024 &&
    testDate.getUTCFullYear() === year &&
    testDate.getUTCMonth() + 1 === month &&
    testDate.getUTCDate() === day;

  return isValid ? { year, month, day } : null;
}

// --------------------------------------------------
// Excel time parsing
// --------------------------------------------------

function parseExcelTime(value) {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value < 1
  ) {
    const totalMinutes = Math.round(value * 1440);

    if (totalMinutes >= 1440) {
      return null;
    }

    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  }

  const match = clean(value).match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);

  if (match[3]) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    hour = (hour % 12) + (match[3].toLowerCase() === "pm" ? 12 : 0);
  }

  if (hour >= 24 || minute >= 60) {
    return null;
  }

  return { hour, minute };
}

// --------------------------------------------------
// Europe/London timezone conversion
// --------------------------------------------------

function toLondonTimestamp(date, time) {
  const utcGuess = Date.UTC(
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

  function matchesLocalTime(timestamp) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(timestamp))
        .map((part) => [part.type, part.value])
    );

    return (
      Number(parts.year) === date.year &&
      Number(parts.month) === date.month &&
      Number(parts.day) === date.day &&
      Number(parts.hour) === time.hour &&
      Number(parts.minute) === time.minute
    );
  }

  const candidates = [utcGuess, utcGuess - 3600000].filter(matchesLocalTime);

  // Reject invalid or ambiguous DST times.
  return candidates.length === 1 ? candidates[0] : null;
}

// --------------------------------------------------
// DynamoDB read-only scan
// --------------------------------------------------

async function scanAllItems() {
  const items = [];
  let exclusiveStartKey;

  do {
    const response = await dynamoClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ConsistentRead: true,
        ...(exclusiveStartKey ? { ExclusiveStartKey: exclusiveStartKey } : {}),
      })
    );

    items.push(...(response.Items || []));
    exclusiveStartKey = response.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}

// --------------------------------------------------
// Read Excel workbook
// --------------------------------------------------

const workbook = XLSX.readFile(excelFile, {
  cellDates: false,
});

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

const extractedJobs = [];

for (const monthName of MONTHS) {
  const worksheet = workbook.Sheets[monthName];

  if (!worksheet) {
    throw new Error(`Missing worksheet: ${monthName}`);
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: true,
  });

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (const columnOffset of [0, 6]) {
      const fields = (rows[rowIndex] || []).slice(
        columnOffset,
        columnOffset + 5
      );

      const [rawDate, rawTime, rawAddress, rawPrice, rawPaymentMethod] = fields;

      const address = clean(rawAddress);

      if (!address || /^(address|total week|week\s*\d|total)$/i.test(address)) {
        continue;
      }

      if (
        clean(rawDate).toLowerCase() === "date" ||
        clean(rawTime).toLowerCase() === "time"
      ) {
        continue;
      }

      const date = parseExcelDate(rawDate);
      const time = parseExcelTime(rawTime);

      const startTimestamp =
        date && time ? toLondonTimestamp(date, time) : null;

      const rawPriceString = clean(rawPrice).replace(/[£,\s]/g, "");

      const price =
        rawPriceString !== "" && /^\d+(?:\.\d+)?$/.test(rawPriceString)
          ? Number(rawPriceString)
          : null;

      extractedJobs.push({
        month: monthName,
        excelRow: rowIndex + 1,
        columnBlock: columnOffset === 0 ? "A:E" : "G:K",

        rawDate,
        rawTime,
        address,
        rawPrice,
        rawPaymentMethod,

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

        startTimestamp,
        endTimestamp: startTimestamp === null ? null : startTimestamp + 3600000,

        price,
        postcode: extractPostcode(address),
        normalizedStreet: normalizeStreet(address),
      });
    }
  }
}

// --------------------------------------------------
// Load existing DEV data
// --------------------------------------------------

console.log(`Extracted ${extractedJobs.length} job candidates.`);

console.log(`Scanning ${TABLE_NAME} (READ-ONLY)...`);

const dynamoItems = await scanAllItems();

const customers = new Map();
const cleaningAddresses = [];
const existingJobs = [];

for (const item of dynamoItems) {
  const partitionKey = getDynamoValue(item, "PK");
  const sortKey = getDynamoValue(item, "SK");

  if (!partitionKey.startsWith("customer_")) {
    continue;
  }

  const customerId = partitionKey.slice("customer_".length);

  if (sortKey === "profile" && getDynamoValue(item, "status") !== "deleted") {
    customers.set(customerId, item);
  }

  if (
    sortKey.startsWith("address_") &&
    getDynamoValue(item, "status") === "active"
  ) {
    const address = getDynamoValue(item, "address");
    const postcode = getDynamoValue(item, "postcode");

    cleaningAddresses.push({
      customerId,
      addressId: sortKey.slice("address_".length),
      address,
      postcode,
      normalizedPostcode: normalizePostcode(postcode),
      normalizedStreet: normalizeStreet(address, postcode),
    });
  }

  if (sortKey.startsWith("job_")) {
    existingJobs.push({
      customerId,
      addressId: getDynamoValue(item, "address_id"),
      startTimestamp: Number(getDynamoValue(item, "start")),
      price: Number(getDynamoValue(item, "price")),
    });
  }
}

// --------------------------------------------------
// Match Excel jobs to cleaning addresses
// --------------------------------------------------

const analysisResults = [];
const seenExcelJobs = new Set();

for (const job of extractedJobs) {
  let status = "REVIEW";
  let reason = "";

  let customerId = "";
  let addressId = "";
  let matchedAddress = "";
  let candidateCount = 0;

  const exactMatches = cleaningAddresses.filter(
    (address) =>
      address.normalizedStreet &&
      address.normalizedStreet === job.normalizedStreet &&
      (!job.postcode || address.normalizedPostcode === job.postcode)
  );

  const postcodeMatches = job.postcode
    ? cleaningAddresses.filter(
        (address) => address.normalizedPostcode === job.postcode
      )
    : [];

  let candidates = exactMatches;

  if (!job.postcode && exactMatches.length === 0) {
    candidates = cleaningAddresses.filter(
      (address) =>
        address.normalizedStreet &&
        address.normalizedStreet === job.normalizedStreet
    );
  }

  candidateCount = candidates.length;

  if (candidates.length === 1) {
    customerId = candidates[0].customerId;
    addressId = candidates[0].addressId;

    matchedAddress = `${candidates[0].address}, ` + candidates[0].postcode;
  }

  if (!parseExcelDate(job.rawDate)) {
    reason = "INVALID_OR_MISSING_DATE";
  } else if (!parseExcelTime(job.rawTime) || job.startTimestamp === null) {
    reason = "INVALID_OR_MISSING_TIME_OR_DST";
  } else if (job.price === null) {
    reason = "INVALID_OR_MISSING_PRICE";
  } else if (!job.normalizedStreet) {
    reason = "INVALID_ADDRESS";
  } else if (job.postcode && exactMatches.length === 1) {
    status = "MATCH";
    reason = "UNIQUE_EXACT_ADDRESS_AND_POSTCODE";
  } else if (!job.postcode && exactMatches.length === 1) {
    reason = "ADDRESS_MATCH_BUT_EXCEL_POSTCODE_MISSING";
  } else if (exactMatches.length > 1) {
    reason = "AMBIGUOUS_ADDRESS_MATCH";
  } else if (postcodeMatches.length > 0) {
    reason = "POSTCODE_MATCH_ONLY_REVIEW";
    candidateCount = postcodeMatches.length;
  } else {
    status = "NO_MATCH";
    reason = "NO_CLEANING_ADDRESS_MATCH";
  }

  if (status === "MATCH" && !customers.has(customerId)) {
    status = "REVIEW";
    reason = "CUSTOMER_PROFILE_MISSING";
  }

  // Detect possible duplicate rows in the Excel workbook.
  const fingerprint = [
    job.date,
    job.time,
    job.normalizedStreet,
    job.postcode,
    job.price,
  ].join("|");

  if (seenExcelJobs.has(fingerprint)) {
    status = "REVIEW";
    reason = "POSSIBLE_DUPLICATE_IN_EXCEL";
  }

  seenExcelJobs.add(fingerprint);

  // Detect jobs already stored in DEV.
  const alreadyExists =
    customerId &&
    job.startTimestamp !== null &&
    existingJobs.some(
      (existingJob) =>
        existingJob.customerId === customerId &&
        existingJob.addressId === addressId &&
        existingJob.startTimestamp === job.startTimestamp
    );

  if (alreadyExists) {
    status = "REVIEW";
    reason = "JOB_ALREADY_EXISTS_IN_DEV";
  }

  analysisResults.push({
    ...job,
    status,
    reason,
    customerId,
    addressId,
    matchedAddress,
    candidateCount,
  });
}

// --------------------------------------------------
// Generate CSV report
// --------------------------------------------------

const headers = [
  "status",
  "reason",
  "month",
  "excelRow",
  "columnBlock",
  "rawDate",
  "rawTime",
  "date",
  "time",
  "startTimestamp",
  "endTimestamp",
  "excelAddress",
  "detectedPostcode",
  "rawPrice",
  "price",
  "paidBy",
  "customerId",
  "addressId",
  "matchedAddress",
  "candidateCount",
];

const reportRows = analysisResults.map((job) => [
  job.status,
  job.reason,
  job.month,
  job.excelRow,
  job.columnBlock,
  job.rawDate,
  job.rawTime,
  job.date,
  job.time,
  job.startTimestamp ?? "",
  job.endTimestamp ?? "",
  job.address,
  job.postcode,
  job.rawPrice,
  job.price ?? "",
  job.rawPaymentMethod,
  job.customerId,
  job.addressId,
  job.matchedAddress,
  job.candidateCount,
]);

const csvContent =
  "\uFEFF" +
  [
    headers.map(escapeCsv).join(","),
    ...reportRows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n") +
  "\n";

fs.writeFileSync(outputFile, csvContent);

// --------------------------------------------------
// Print summary
// --------------------------------------------------

const counts = Object.fromEntries(
  ["MATCH", "REVIEW", "NO_MATCH"].map((status) => [
    status,
    analysisResults.filter((job) => job.status === status).length,
  ])
);

console.log("");
console.log("=== 2024 JOB MIGRATION ANALYSIS ===");
console.log(`DynamoDB table: ${TABLE_NAME}`);
console.log(`Existing customers: ${customers.size}`);
console.log(`Existing cleaning addresses: ${cleaningAddresses.length}`);
console.log(`Existing jobs: ${existingJobs.length}`);
console.log("");
console.log(`Excel job candidates: ${analysisResults.length}`);
console.log(`MATCH: ${counts.MATCH}`);
console.log(`REVIEW: ${counts.REVIEW}`);
console.log(`NO_MATCH: ${counts.NO_MATCH}`);
console.log("");
console.log(`CSV report: ${outputFile}`);
console.log("DRY RUN: No data was written to DynamoDB.");
