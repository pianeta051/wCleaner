const {
  createInvoice,
  editInvoiceContent,
  getCleaningAddress,
  getInvoices,
  getCustomerInvoices,
  getInvoice,
  deleteInvoice,
  updateInvoicePaid,
  updateInvoiceSettings,
  getInvoiceSettings,
  getAddressesForJobs,
  getAddressesForInvoices,
} = require("../db");

const {
  mapCleaningAddress,
  mapInvoice,
  mapInvoiceSettings,
} = require("../mappers");

const { generateToken, parseToken } = require("../token");

const DEFAULT_INVOICE_SETTINGS = {
  companyName: "LOGO",
  logoUrl: "",
  companyAddressLines: ["123 Business Street", "London, UK"],
  companyPhone: "020 7000 0000",
  companyEmail: "",
  companyWebsite: "www.website.co.uk",
  bankDetails: "Bank: Barclays | Sort Code: 00-00-00 | Acc: 12345678",
  paymentInfo: "Payment due within 14 days. Thank you for your business!",
  footerNotes: "",
};

const setInvoicesRoutes = (app) => {
  app.get("/settings/invoice", async function (_req, res) {
    const item = await getInvoiceSettings();

    res.json({
      settings: item ? mapInvoiceSettings(item) : DEFAULT_INVOICE_SETTINGS,
    });
  });

  app.put("/settings/invoice", async function (req, res) {
    const groups = req.authData?.groups ?? [];
    const isAdmin = groups.includes("Admin");

    if (!isAdmin) {
      res.status(403).json({ error: "UNAUTHORIZED" });
      return;
    }

    const settings = {
      ...DEFAULT_INVOICE_SETTINGS,
      ...req.body,
    };

    const updatedSettings = await updateInvoiceSettings(settings);

    res.json({ settings: updatedSettings });
  });

  app.get("/invoices", async function (req, res) {
    const nextToken = req.query?.nextToken;
    const paginate = req.query?.paginate !== "false";

    const sortBy = req.query?.sortBy ?? "invoiceNumber";
    const direction = req.query?.sortDirection ?? "desc";

    const from = req.query?.from ? Number(req.query.from) : undefined;
    const to = req.query?.to ? Number(req.query.to) : undefined;

    const paid =
      req.query?.paid === undefined ? undefined : req.query.paid === "true";

    const exclusiveStartKey =
      nextToken && typeof nextToken === "string" && nextToken.trim().length
        ? parseToken(nextToken)
        : undefined;

    const { items, lastEvaluatedKey } = await getInvoices(
      {
        exclusiveStartKey,
        enabled: paginate,
      },
      {
        sortBy,
        direction,
      },
      {
        from,
        to,
        paid,
      }
    );

    let invoices = items.map(mapInvoice);

    const addresses = await getAddressesForInvoices(invoices);

    invoices = invoices.map((invoice) => ({
      ...invoice,
      address: addresses[`${invoice.customerId}_${invoice.addressId}`],
    }));

    const responseToken = generateToken(lastEvaluatedKey);

    res.json({ invoices, nextToken: responseToken });
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

      if (!isAdmin) {
        res.status(403).json({ error: "User unauthorized" });
        return;
      }

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

      if (!isAdmin) {
        res.status(403).json({ error: "User unauthorized" });
        return;
      }

      await deleteInvoice(customerId, jobId);
      res.json({ message: "INVOICE_DELETED" });
    } catch (err) {
      if (err === "INVOICE_NOT_FOUND") {
        res.status(404).json({ error: "INVOICE_NOT_FOUND" });
        return;
      }

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
          res.status(403).json({ error: "User unauthorized" });
          return;
        }

        if (typeof paid !== "boolean") {
          res.status(400).json({ error: "INVALID_PAID_VALUE" });
          return;
        }

        const invoice = await updateInvoicePaid(customerId, jobId, paid);

        res.json({ invoice });
      } catch (err) {
        if (err === "INVOICE_NOT_FOUND") {
          res.status(404).json({ error: "INVOICE_NOT_FOUND" });
          return;
        }

        throw err;
      }
    }
  );
};

module.exports = {
  setInvoicesRoutes,
};
