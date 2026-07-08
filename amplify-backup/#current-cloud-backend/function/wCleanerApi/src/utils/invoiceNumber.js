const INVOICE_PREFIX = "CWC";
const INVOICE_DIGITS = 5;
const formatInvoiceNumber = (value) => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return undefined;
  }

  return `${INVOICE_PREFIX}${String(num).padStart(INVOICE_DIGITS, "0")}`;
};

///Fill with 0s on the left.
const padInvoice = (value) => {
  const num = Number(value);

  if (!Number.isFinite(num) || num < 0) {
    throw "INVALID_INVOICE_NUMBER";
  }

  return String(num).padStart(INVOICE_DIGITS, "0");
};

//Convert CWC00015 to 15
const parseInvoiceNumber = (input) => {
  if (input === undefined || input === null) {
    throw "INVALID_INVOICE_NUMBER";
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0) {
      throw "INVALID_INVOICE_NUMBER";
    }
    return input;
  }

  if (typeof input !== "string") {
    throw "INVALID_INVOICE_NUMBER";
  }

  const trimmed = input.trim().toUpperCase();

  if (trimmed.startsWith(INVOICE_PREFIX)) {
    const numericPart = trimmed.replace(INVOICE_PREFIX, "");
    const parsed = Number(numericPart);

    if (!Number.isFinite(parsed)) {
      throw "INVALID_INVOICE_NUMBER";
    }

    return parsed;
  }
  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw "INVALID_INVOICE_NUMBER";
  }

  return parsed;
};

module.exports = {
  INVOICE_PREFIX,
  INVOICE_DIGITS,
  formatInvoiceNumber,
  padInvoice,
  parseInvoiceNumber,
};
