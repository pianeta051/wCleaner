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

const customers = [
  {
    id: 1,
    name: "Carlos",
    address: "123 Fake St",
    postcode: "2005",
    mainTelephone: "+12345",
    secondTelephone: "+54321",
    email: "carlos@fake.com",
    url: "carlos",
  },
  {
    id: 2,
    name: "John Smith",
    address: "46 Fauna St",
    postcode: "LU65DF",
    mainTelephone: "+48455",
    secondTelephone: "+54545",
    email: "john@fake.com",
    url: "john",
  },
  {
    id: 3,
    name: "Amalia Rosso",
    address: "87 Tilling St",
    postcode: "MD35PF",
    mainTelephone: "+997555",
    secondTelephone: "+36544",
    email: "amalia@fake.com",
    url: "amalia",
  },
];

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

// Get all customers
app.get("/customers", function (req, res) {
  res.json({ customers });
});

// Get a single customer
app.get("/customers/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.post("/customers", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.put("/customers/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.delete("/customers/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
