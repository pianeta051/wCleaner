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
  getCustomers,
  getCustomerBySlug,
  deleteCustomer,
  editCustomer,
} = require("./db");

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

const mapCustomer = (customerFromDb) => ({
  id: customerFromDb.id.S,
  name: customerFromDb.name.S,
  address: customerFromDb.address.S,
  postcode: customerFromDb.postcode.S,
  mainTelephone: customerFromDb.mainTelephone.S,
  secondTelephone: customerFromDb.secondTelephone.S,
  email: customerFromDb.email.S,
  slug: customerFromDb.slug.S,
});

// Get all customers
app.get("/customers", async function (_, res) {
  const customers = (await getCustomers()).map(mapCustomer);
  console.log(customers);
  res.json({ customers });
});

// Get a single customer
app.get("/customers/*", async function (req, res) {
  const slug = req.params[0];
  const customerFromDb = await getCustomerBySlug(slug);
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
    } else {
      throw error;
    }
  }
});

//Update a customer

app.put("/customers/*", async function (req, res) {
  try {
    const id = req.params[0];
    const editedCustomer = await editCustomer(id, req.body);
    res.json({ customer: editedCustomer });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      res.status(409).json({
        error: "Email Already Exists",
      });
    } else {
      throw error;
    }
  }
});

// Delete a Customer
app.delete("/customers/*", async function (req, res) {
  const id = req.params[0];
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
