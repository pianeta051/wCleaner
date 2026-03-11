const {
  addCustomer,
  addCustomerAddress,
  getCleaningAddresses,
  getCustomers,
  getCustomerBySlug,
  getCustomerById,
  deleteCustomer,
  editAddress,
  editCustomer,
} = require("../db");

const { mapCleaningAddress, mapCustomer } = require("../mappers");

const { generateToken, parseToken } = require("../token");

const setCustomerRoutes = (app) => {
  app.get("/customers", async function (req, res) {
    const nextToken = req.query?.nextToken;
    const limit = req.query?.limit ? +req.query?.limit : 50;

    const search = req.query?.search;
    const outcodeFilter = req.query?.outcodeFilter
      ? req.query.outcodeFilter.split(",").filter(Boolean)
      : undefined;

    const paginationEnabled = req.query?.paginationDisabled !== "true";

    const exclusiveStartKey =
      nextToken && typeof nextToken === "string" && nextToken.trim().length
        ? parseToken(nextToken)
        : undefined;

    const { items, lastEvaluatedKey } = await getCustomers(
      { searchInput: search, outcodeFilter },
      { exclusiveStartKey, limit, enabled: paginationEnabled }
    );

    const customers = items.map(mapCustomer);

    // genete token only if there is a real lastEvaluatedKey
    const responseToken = generateToken(lastEvaluatedKey);

    res.json({ customers, nextToken: responseToken });
  });

  app.get("/customers/:slug", async function (req, res) {
    const slug = req.params.slug;
    const customerFromDb = await getCustomerBySlug(slug);
    if (!customerFromDb || customerFromDb.status.S === "deleted") {
      res.status(404).json({ message: "This customer does not exist" });
      return;
    }
    const customer = mapCustomer(customerFromDb);
    const cleaningAddresses = await getCleaningAddresses(customer.id);
    customer.cleaningAddresses = cleaningAddresses.map(mapCleaningAddress);
    res.json({ customer });
  });

  app.get("/customer-by-id/:id", async function (req, res) {
    const id = req.params.id;
    const customerFromDb = await getCustomerById(id);

    if (!customerFromDb || customerFromDb.status.S === "deleted") {
      res.status(404).json({ message: "This customer does not exist" });
      return;
    }
    const customer = mapCustomer(customerFromDb);
    res.json({ customer });
  });

  app.post("/customers", async function (req, res) {
    try {
      const createdCustomer = await addCustomer(req.body);
      const cleaningAddresses = req.body.cleaningAddresses;
      if (cleaningAddresses?.length > 0) {
        for (const cleaningAddress of cleaningAddresses) {
          await addCustomerAddress(createdCustomer.id, cleaningAddress);
        }
      }
      res.json({ customer: createdCustomer });
    } catch (error) {
      if (error === "EMAIL_ALREADY_EXISTS") {
        res.status(409).json({
          error: "Email Already Exists",
        });
      } else if (error === "EMAIL_CANNOT_BE_EMPTY") {
        res.status(400).json({
          error: "Email cannot be empty",
        });
      } else if (error === "NAME_CANNOT_BE_EMPTY") {
        res.status(400).json({
          error: "Name cannot be empty",
        });
      } else if (error === "INVALID_ADDRESS") {
        res.status(400).json({
          error: "One of the cleaning addresses is invalid",
        });
      } else {
        throw error;
      }
    }
  });

  app.put("/customers/:id", async function (req, res) {
    try {
      const id = req.params.id;
      const { cleaningAddresses, ...customer } = req.body;

      const editedCustomer = await editCustomer(id, customer);
      const newAddresses = cleaningAddresses.filter((address) => !address.id);
      if (newAddresses?.length > 0) {
        for (const newAddress of newAddresses) {
          await addCustomerAddress(editedCustomer.id, newAddress);
        }
      }
      const addressesToBeUpdated = cleaningAddresses.filter(
        (address) => address.id
      );
      if (addressesToBeUpdated?.length) {
        for (const address of addressesToBeUpdated) {
          await editAddress(editedCustomer.id, address);
        }
      }
      const editedCleaningAddresses = await getCleaningAddresses(customer.id);
      editedCustomer.cleaningAddresses =
        editedCleaningAddresses.map(mapCleaningAddress);

      res.json({ customer: editedCustomer });
    } catch (error) {
      if (error === "EMAIL_ALREADY_REGISTERED") {
        res.status(409).json({
          error: "Email Already Exists",
        });
      } else if (error === "NOT_EXISTING_CUSTOMER") {
        res.status(404).json({
          error: "Not existing customer",
        });
      } else if (error.message === "DUPLICATED_ADDRESS_NAME") {
        res.status(409).json({
          error: "Address name already exists",
        });
      } else {
        throw error;
      }
    }
  });

  app.delete("/customers/:id", async function (req, res) {
    try {
      const id = req.params.id;
      await deleteCustomer(id);
      res.json({ message: "Customer deleted" });
    } catch (e) {
      if (e === "There are pending jobs") {
        res.status(400).json({ error: "This customer has pending jobs" });
        return;
      }
      throw e;
    }
  });
};

module.exports = {
  setCustomerRoutes,
};
