const {
  createInvoice,
  getCleaningAddress,
  getCleaningAddressById,
  getInvoices,
  getCustomerInvoices,
  getInvoice,
  deleteInvoice,
  updateInvoicePaid,
} = require("../db");
const { mapCleaningAddress, mapInvoice } = require("../mappers");
const { generateToken, parseToken } = require("../token");

const setInvoicesRoutes = (app) => {
  app.get("/invoices", async function (req, res) {
    try {
      const nextToken = req.query?.nextToken;
      const paginate = req.query?.paginate !== "false";
      const sortBy = req.query?.sortBy;
      const sortDirection = req.query?.sortDirection;
      const from = req.query?.from ? Number(req.query.from) : undefined;
      const to = req.query?.to ? Number(req.query.to) : undefined;
      const exclusiveStartKey = parseToken(nextToken);

      if (req.query?.from && Number.isNaN(from)) {
        res.status(400).json({ error: "INVALID_FROM_DATE" });
        return;
      }

      if (req.query?.to && Number.isNaN(to)) {
        res.status(400).json({ error: "INVALID_TO_DATE" });
        return;
      }

      const groups = req.authData?.groups || [];
      const isAdmin = groups.includes("Admin");

      if (!isAdmin) {
        res.status(403).json({ error: "User unauthorized" });
        return;
      }

      const { items: invoicesFromDb, lastEvaluatedKey } = await getInvoices(
        {
          exclusiveStartKey,
          enabled: paginate,
        },
        {
          sortBy,
          direction: sortDirection,
        },
        {
          from,
          to,
        }
      );

      let invoices = invoicesFromDb.map(mapInvoice);

      const addressIds = Array.from(
        new Set(invoices.map((invoice) => invoice.addressId).filter(Boolean))
      );

      const addresses = await Promise.all(
        addressIds.map(async (addressId) => {
          try {
            const addressFromDb = await getCleaningAddressById(addressId);
            return addressFromDb
              ? mapCleaningAddress(addressFromDb)
              : undefined;
          } catch (error) {
            console.error(error);
            return undefined;
          }
        })
      );

      const addressMap = {};
      addresses.forEach((address) => {
        if (address) {
          addressMap[address.id] = address;
        }
      });

      const responseToken = generateToken(lastEvaluatedKey);

      invoices = invoices.map((invoice) => ({
        ...invoice,
        address: addressMap[invoice.addressId],
      }));

      res.json({
        invoices,
        nextToken: responseToken,
      });
    } catch (error) {
      throw error;
    }
  });

  app.get("/customers/:customerId/invoices", async function (req, res) {
    try {
      const nextToken = req.query?.nextToken;
      const limit = req.query?.limit ? +req.query?.limit : 50;

      const { customerId } = req.params;

      const groups = req.authData?.groups || [];
      const isAdmin = groups.includes("Admin");

      if (!isAdmin) {
        res.status(403).json({ error: "User unauthorized" });
        return;
      }
      const paginationEnabled = req.query?.paginationDisabled !== "true";

      const exclusiveStartKey =
        nextToken && typeof nextToken === "string" && nextToken.trim().length
          ? parseToken(nextToken)
          : undefined;

      const { items, lastEvaluatedKey } = await getCustomerInvoices(
        customerId,
        {
          exclusiveStartKey,
          limit,
          enabled: paginationEnabled,
        }
      );
      const invoices = items.map(mapInvoice);

      const responseToken = generateToken(lastEvaluatedKey);

      res.json({ invoices, nextToken: responseToken });
    } catch (error) {
      throw error;
    }
  });

  app.post("/customers/:customerId/jobs/:jobId/invoice", async (req, res) => {
    const { customerId, jobId } = req.params;
    const { date, description, addressId } = req.body;

    try {
      const groups = req.authData?.groups || [];
      const isAdmin = groups.includes("Admin");

      if (!isAdmin) {
        res.status(403).json({ error: "User unauthorized" });
        return;
      }

      if (!date) {
        res.status(400).json({ error: "MISSING_INVOICE_DATE" });
        return;
      }

      if (!description) {
        res.status(400).json({ error: "MISSING_INVOICE_DESCRIPTION" });
        return;
      }

      if (!addressId) {
        res.status(400).json({ error: "MISSING_INVOICE_ADDRESS" });
        return;
      }

      const invoice = await createInvoice(customerId, jobId, {
        date,
        description,
        addressId,
      });

      res.json({ invoice });
    } catch (err) {
      if (err === "INVOICE_ALREADY_EXISTS") {
        res.status(400).json({ error: "INVOICE_ALREADY_EXISTS" });
        return;
      }
      if (err === "INVOICE_NUMBER_IN_USE") {
        res.status(400).json({ error: "INVOICE_NUMBER_IN_USE" });
        return;
      }
      if (err === "INVOICE_NUMBER_OUT_OF_RANGE") {
        res.status(400).json({ error: "INVOICE_NUMBER_OUT_OF_RANGE" });
        return;
      }
      if (err === "INVALID_INVOICE_NUMBER") {
        res.status(400).json({ error: "INVALID_INVOICE_NUMBER" });
        return;
      }
      if (err === "CUSTOMER_NOT_FOUND") {
        res.status(404).json({ error: "CUSTOMER_NOT_FOUND" });
        return;
      }
      if (err === "JOB_NOT_FOUND") {
        res.status(404).json({ error: "JOB_NOT_FOUND" });
        return;
      }
      throw err;
    }
  });

  app.put("/customers/:customerId/jobs/:jobId/invoice", async (req, res) => {
    const { customerId, jobId } = req.params;
    const { date, description, addressId } = req.body;

    try {
      const groups = req.authData?.groups || [];
      const isAdmin = groups.includes("Admin");
      if (!isAdmin) return res.status(403).json({ error: "User unauthorized" });

      const invoice = await editInvoiceContent(customerId, jobId, {
        date,
        description,
        addressId,
      });
      res.json({ invoice });
    } catch (err) {
      if (err === "INVOICE_NOT_FOUND") {
        res.status(404).json({ error: "INVOICE_NOT_FOUND" });
        return;
      }

      throw err;
    }
  });

  app.delete("/customers/:customerId/jobs/:jobId/invoice", async (req, res) => {
    const { customerId, jobId } = req.params;

    try {
      const groups = req.authData?.groups || [];
      const isAdmin = groups.includes("Admin");
      if (!isAdmin) return res.status(403).json({ error: "User unauthorized" });

      await deleteInvoice(customerId, jobId);
      res.json({ message: "INVOICE_DELETED" });
    } catch (err) {
      if (err === "INVOICE_NOT_FOUND")
        return res.status(404).json({ error: "INVOICE_NOT_FOUND" });

      throw err;
    }
  });

  app.get("/customers/:customerId/jobs/:jobId/invoice", async (req, res) => {
    const { jobId, customerId } = req.params;

    const invoice = await getInvoice(customerId, jobId);

    if (!invoice) {
      res.status(404).json({ error: "INVOICE_NOT_FOUND" });
      return;
    }
    const addressFromDB = invoice.addressId
      ? await getCleaningAddress(customerId, invoice.addressId)
      : undefined;

    invoice.address = addressFromDB
      ? mapCleaningAddress(addressFromDB)
      : undefined;
    res.json({ invoice });
  });

  app.put(
    "/customers/:customerId/jobs/:jobId/invoice/paid",
    async (req, res) => {
      const { jobId, customerId } = req.params;
      const { paid } = req.body;

      try {
        const groups = req.authData?.groups || [];
        const isAdmin = groups.includes("Admin");

        if (!isAdmin) {
          return res.status(403).json({ error: "User unauthorized" });
        }

        if (typeof paid !== "boolean") {
          return res.status(400).json({ error: "INVALID_PAID_VALUE" });
        }

        const invoice = await updateInvoicePaid(customerId, jobId, paid);

        res.json({ invoice });
      } catch (err) {
        if (err === "INVOICE_NOT_FOUND") {
          return res.status(404).json({ error: "INVOICE_NOT_FOUND" });
        }

        throw err;
      }
    }
  );
};

module.exports = {
  setInvoicesRoutes,
};
