/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const {
  addCustomer,
  addCustomerAddress,
  addCustomerJob,
  addCustomerNote,
  addJobType,
  getCleaningAddresses,
  getCustomers,
  getCustomerBySlug,
  getCustomerById,
  getCustomerJobs,
  getJob,
  getJobs,
  getJobType,
  getJobTypes,
  getOutcodes,
  deleteCustomer,
  deleteCustomerNote,
  deleteJobType,
  editJobFromCustomer,
  deleteJobFromCustomer,
  editCustomer,
  editCustomerNote,
  editJobType,
  addFile,
} = require("./db");

const {
  mapCleaningAddress,
  mapCustomer,
  mapCustomerJobs,
  mapJob,
  mapJobFromRequestBody,
  mapJobTypeFromRequestBody,
  mapJobTemporalFilters,
  mapJobType,
} = require("./mappers");

const { generateToken, parseToken } = require("./token");
const { getAuthData, getJobUsers } = require("./authentication");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(async function (req, res, next) {
  req.authData = await getAuthData(req);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Get all customer

app.get("/customers", async function (req, res) {
  const nextToken = req.query?.nextToken;
  const limit = req.query?.limit ? +req.query?.limit : 50;
  const search = req.query?.search;
  const outcodeFilter = req.query?.outcodeFilter
    ? req.query.outcodeFilter.split(",")
    : undefined;

  const paginationEnabled = req.query?.paginationDisabled !== "true";
  const exclusiveStartKey = parseToken(nextToken);
  const { items, lastEvaluatedKey } = await getCustomers(
    { searchInput: search, outcodeFilter },
    { exclusiveStartKey, limit, enabled: paginationEnabled }
  );

  const customers = items.map(mapCustomer);
  const responseToken = generateToken(lastEvaluatedKey);
  res.json({ customers, nextToken: responseToken });
});

// Get outcodes
app.get("/outcodes", async function (req, res) {
  const { outcodes } = await getOutcodes();
  res.json({ outcodes });
});

// Get a single customer
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

// Get a single customer by id
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

// Add a customer
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

//Update a customer

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
    } else {
      throw error;
    }
  }
});

// Delete a Customer
app.delete("/customers/:id", async function (req, res) {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.post("/customers/:customerId/address", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const { name, address, postcode } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    if (!address) {
      return res.status(400).json({ error: "Address cannot be empty" });
    }

    if (!postcode) {
      return res.status(400).json({ error: "postcode cannot be empty" });
    }

    let createdCustomerAddress = null;
    try {
      createdCustomerAddress = await addCustomerAddress(
        customerId,
        customerAddress
      );
    } catch (e) {
      if (e.message === "CUSTOMER_NOT_FOUND") {
        return res.status(404).json({ error: "The customer does not exist" });
      }
      throw e;
    }

    res.json({
      customerAddress: {
        ...createdCustomerAddress,
        customerId,
      },
    });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(404).json({ error: "Customer not found" });
    }

    console.error("Internal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//JOBS

// Get all JOBS

app.get("/jobs", async function (req, res) {
  const nextToken = req.query?.nextToken;
  const startParameter = req.query?.start;
  const endParameter = req.query?.end;
  const paginate = req.query?.paginate !== "false";
  const { start, end } = mapJobTemporalFilters(startParameter, endParameter);
  const order = req.query?.order;
  const exclusiveStartKey = parseToken(nextToken);
  const userSub = req.authData?.userSub;
  const groups = req.authData?.groups;
  const isAdmin = groups.includes("Admin");
  const { items, lastEvaluatedKey } = await getJobs(
    {
      start,
      end,
      assignedTo: isAdmin ? undefined : userSub,
    },
    order,
    exclusiveStartKey,
    paginate
  );

  const responseToken = generateToken(lastEvaluatedKey);
  let jobs = items.map(mapJob);
  if (isAdmin) {
    jobs = await getJobUsers(items);
  }
  res.json({ jobs, nextToken: responseToken });
});

app.get("/customers/:customerId/jobs/:jobId", async function (req, res) {
  const customerId = req.params.customerId;
  const jobId = req.params.jobId;
  const jobFromDb = await getJob(customerId, jobId);
  let job = mapJob(jobFromDb);
  const groups = req.authData?.groups;
  const isAdmin = groups.includes("Admin");
  if (isAdmin) {
    job = (await getJobUsers([jobFromDb]))[0];
  } else {
    const restrictedCustomer = {
      id: job.customer.id,
      slug: job.customer.slug,
      name: job.customer.name,
      address: job.customer.address,
      postcode: job.customer.postcode,
      fileUrls: job.customer.fileUrls,
      notes: job.customer.notes,
    };
    job.customer = restrictedCustomer;
  }
  const jobType = await getJobType(job.jobTypeId);
  job.jobTypeName = mapJobType(jobType).name;
  res.json({ job });
});

// Get a single customer's Job
app.get("/customers/:customerId/jobs", async function (req, res) {
  const id = req.params.customerId;
  const startParameter = req.query?.start;
  const endParameter = req.query?.end;
  const { start, end } = mapJobTemporalFilters(startParameter, endParameter);
  const userSub = req.authData?.userSub;
  const groups = req.authData?.groups;
  const order = req.query?.order;
  const isAdmin = groups.includes("Admin");

  const { items } = await getCustomerJobs(
    id,
    { start, end, assignedTo: isAdmin ? undefined : userSub },
    order
  );
  let jobs = items.map(mapCustomerJobs);
  if (isAdmin) {
    jobs = await getJobUsers(items);
  }

  try {
    res.json({ jobs });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

//Create a Job
app.post("/customers/:customerId/job", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const job = mapJobFromRequestBody(req.body);
    const userSub = req.authData?.userSub;
    const email = req.authData?.userInfo?.email;
    const name = req.authData?.userInfo?.name;
    const color = req.authData?.userInfo?.color;
    const groups = req.authData?.groups;
    const isAdmin = groups?.includes("Admin");

    let assignedTo = userSub;
    if (isAdmin && job?.assignedTo) {
      assignedTo = job.assignedTo;
    }
    const createdJob = await addCustomerJob(customerId, job, assignedTo);
    res.json({
      job: {
        ...createdJob,
        customerId,
        assignedTo: {
          sub: assignedTo,
          email,
          name,
          color,
        },
      },
    });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.put("/customers/:customerId/job/:jobId", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const jobId = req.params.jobId;
    const updatedJob = req.body;

    const jobUpdated = await editJobFromCustomer(
      customerId,
      jobId,
      mapJobFromRequestBody(updatedJob)
    );
    res.json({ job: { ...jobUpdated, assignedTo: undefined } });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

app.delete("/customers/:customerId/job/:jobId", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const jobId = req.params.jobId;
    await deleteJobFromCustomer(customerId, jobId);
    res.json({ message: "Job Deleted" });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      res.status(404).json({
        error: "Customer not registered!",
      });
    } else {
      throw error;
    }
  }
});

//JOB TYPE FUNCTIONS

app.post("/job-type", async function (req, res) {
  const groups = req.authData?.groups;
  const isAdmin = groups?.includes("Admin");
  if (!isAdmin) {
    res.status(403).json({ error: "You must be Admin" });
    return;
  }
  const jobType = req.body;
  try {
    const createJobType = await addJobType(jobType);
    res.json({ jobType: createJobType });
  } catch (error) {
    if (error === "NAME_CANNOT_BE_EMPTY") {
      res.status(400).json({
        error: "Name cannot be empty",
      });
    } else if (error === "COLOR_CANNOT_BE_EMPTY") {
      res.status(400).json({
        error: "Color cannot be empty",
      });
    } else if (error === "NAME_ALREADY_EXISTS") {
      res.status(400).json({
        error: "Name cannot be duplicated",
      });
    } else if (error === "COLOR_ALREADY_EXISTS") {
      res.status(400).json({
        error: "Color cannot be duplicated",
      });
    } else {
      throw error;
    }
  }
});

//Get job types
app.get("/job-types", async function (req, res) {
  const { items } = await getJobTypes();
  const jobTypes = items.map(mapJobType);
  res.json({ jobTypes });
});

// Update Job Type
app.put("/job-type/:jobTypeId", async function (req, res) {
  const groups = req.authData?.groups;
  const isAdmin = groups?.includes("Admin");
  try {
    const jobTypeId = req.params.jobTypeId;
    const updatedJobType = req.body;
    if (!isAdmin) {
      throw "User unauthorized";
    }
    const jobTypeUpdated = await editJobType(
      jobTypeId,
      mapJobTypeFromRequestBody(updatedJobType)
    );

    res.json({ jobType: jobTypeUpdated });
  } catch (error) {
    {
      if (error === "NAME_CANNOT_BE_EMPTY") {
        res.status(400).json({
          error: "Name cannot be empty",
        });
      } else if (error === "COLOR_CANNOT_BE_EMPTY") {
        res.status(400).json({
          error: "Color cannot be empty",
        });
      } else if (error === "NAME_ALREADY_EXISTS") {
        res.status(400).json({
          error: "Name cannot be duplicated",
        });
      } else if (error === "COLOR_ALREADY_EXISTS") {
        res.status(400).json({
          error: "Color cannot be duplicated",
        });
      } else {
        throw error;
      }
    }
  }
});

app.delete("/job-type/:jobTypeId", async function (req, res) {
  const groups = req.authData?.groups;
  const isAdmin = groups?.includes("Admin");
  try {
    if (!isAdmin) {
      throw "User unauthorized";
    }
    const jobTypeId = req.params.jobTypeId;
    await deleteJobType(jobTypeId);
    res.json({ message: "Job Type Deleted" });
  } catch (error) {
    throw error;
  }
});

app.listen(3000, function () {
  console.log("App started");
});

//FILES
//Add file

app.post("/files", async function (req, res) {
  try {
    const file = req.file;
    const path = req.body.path;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!path) {
      return res.status(400).json({ error: "Path is required" });
    }

    const uploadedPath = await addFile(file.buffer, path);

    res.json({ path: uploadedPath });
  } catch (error) {
    if (error === "INVALID_FILE_TYPE") {
      res.status(400).json({ error: "Invalid file type" });
    } else if (error === "FILE_TOO_LARGE") {
      res.status(413).json({ error: "File too large" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Error" });
    }
  }
});

// Replace fileUrls on a customer
app.put("/customers/:customerId/files", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const { fileUrls } = req.body;

    if (!Array.isArray(fileUrls)) {
      return res
        .status(400)
        .json({ error: "FileUrls must be an array of strings" });
    }

    // Check all elements are strings
    if (!fileUrls.every((url) => typeof url === "string")) {
      return res
        .status(400)
        .json({ error: "FileUrls must contain only strings" });
    }

    const updatedCustomer = await editCustomer(customerId, {
      fileUrls,
    });

    res.json({ customer: updatedCustomer });
  } catch (error) {
    if (error === "NOT_EXISTING_CUSTOMER") {
      res.status(404).json({ error: "Not existing customer" });
    } else {
      throw error;
    }
  }
});

// Customers Notes

//Add customer note

app.post("/customers/:customerId/note", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const { title, content, isFavourite = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    const author = req.authData?.userInfo?.name;
    const timestamp = Date.now();

    const note = {
      title,
      content,
      author,
      timestamp,
      isFavourite,
    };

    let createdNote = null;
    try {
      createdNote = await addCustomerNote(customerId, note);
    } catch (e) {
      if (e.message === "CUSTOMER_NOT_FOUND") {
        return res.status(404).json({ error: "The customer does not exist" });
      }
      throw e;
    }

    res.json({
      note: {
        ...createdNote,
        customerId,
      },
    });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(404).json({ error: "Customer not found" });
    }

    console.error("Internal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/customers/:customerId/note/:noteId", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const noteId = req.params.noteId;
    const { title, content, isFavourite = false } = req.body;
    const updatedBy =
      req.authData?.userInfo?.name ??
      req.authData?.userInfo?.email ??
      req.authData?.userInfo?.userSub;

    if (!title) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    const note = {
      title,
      content,
      isFavourite,
      updatedBy,
    };

    let updatedNote = null;
    try {
      updatedNote = await editCustomerNote(customerId, noteId, note);
    } catch (e) {
      if (e.message === "CUSTOMER_NOT_FOUND") {
        return res.status(404).json({ error: "The customer does not exist" });
      }
      if (e.message === "NOTE_NOT_FOUND") {
        return res.status(404).json({ error: "The note does not exist" });
      }
      throw e;
    }

    res.json({
      note: {
        ...updatedNote,
        customerId,
      },
    });
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(404).json({ error: "Customer not found" });
    }

    console.error("Internal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/customers/:customerId/note/:noteId", async function (req, res) {
  const noteId = req.params.noteId;
  const customerId = req.params.customerId;
  await deleteCustomerNote(customerId, noteId);
  res.json({ message: "Note Deleted" });
});

module.exports = app;
