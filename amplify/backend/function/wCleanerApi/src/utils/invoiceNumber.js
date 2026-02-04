const INVOICE_PREFIX = "CWC";
const INVOICE_DIGITS = 5;

const formatInvoiceNumber = (value) => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return undefined;
  }

  return `${INVOICE_PREFIX}${String(num).padStart(INVOICE_DIGITS, "0")}`;
};

module.exports = {
  INVOICE_PREFIX,
  INVOICE_DIGITS,
  formatInvoiceNumber,
};
