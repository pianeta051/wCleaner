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

//
const {
  addCustomer,
  addCustomerJob,
  getCustomers,
  getCustomerBySlug,
  getCustomerById,
  getCustomerJobs,
  getJobs,
  deleteCustomer,
  editJobFromCustomer,
  deleteJobFromCustomer,
  editCustomer,
} = require("./db");

const {
  mapCustomer,
  mapCustomerJobs,
  mapJob,
  mapJobFromRequestBody,
  mapJobTemporalFilters,
} = require("./mappers");

const { generateToken, parseToken } = require("./token");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Get all customer

app.get("/customers", async function (req, res) {
  const nextToken = req.query?.nextToken;
  const limit = req.query?.limit ? +req.query?.limit : 5;
  const search = req.query?.search;
  const exclusiveStartKey = parseToken(nextToken);
  const { items, lastEvaluatedKey } = await getCustomers(
    exclusiveStartKey,
    limit,
    search
  );

  const customers = items.map(mapCustomer);
  const responseToken = generateToken(lastEvaluatedKey);
  res.json({ customers, nextToken: responseToken });
});

// Get a single customer
app.get("/customers/:slug", async function (req, res) {
  const slug = req.params.slug;
  const customerFromDb = await getCustomerBySlug(slug);
  if (!customerFromDb) {
    res.status(404).json({ message: "This customer does not exist" });
    return;
  }
  const customer = mapCustomer(customerFromDb);
  res.json({ customer });
});

// Get a single customer by id
app.get("/customer-by-id/:id", async function (req, res) {
  const id = req.params.id;
  const customerFromDb = await getCustomerById(id);

  if (!customerFromDb) {
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
    } else {
      throw error;
    }
  }
});

//Update a customer

app.put("/customers/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const editedCustomer = await editCustomer(id, req.body);
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
  const { items, lastEvaluatedKey } = await getJobs(
    {
      start,
      end,
    },
    order,
    exclusiveStartKey,
    paginate
  );
  const responseToken = generateToken(lastEvaluatedKey);
  res.json({ jobs: items.map(mapJob), nextToken: responseToken });
});

// Get a single customer's Job
app.get("/customers/:customerId/jobs", async function (req, res) {
  const id = req.params.customerId;
  const nextToken = req.query?.nextToken;
  const startParameter = req.query?.start;
  const endParameter = req.query?.end;
  const { start, end } = mapJobTemporalFilters(startParameter, endParameter);

  const order = req.query?.order;
  const exclusiveStartKey = parseToken(nextToken);
  const { items, lastEvaluatedKey } = await getCustomerJobs(
    id,
    { start, end },
    exclusiveStartKey,
    order
  );
  const jobs = items.map(mapCustomerJobs);
  const responseToken = generateToken(lastEvaluatedKey);
  try {
    res.json({ jobs, nextToken: responseToken });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

//

//Create a Job
app.post("/customers/:customerId/job", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const job = mapJobFromRequestBody(req.body);
    const createdJob = await addCustomerJob(customerId, job);
    res.json({ job: { ...createdJob, customerId } });
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
    res.json({ job: jobUpdated });
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

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
