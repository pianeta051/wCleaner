/* eslint-disable */
const handler = require("serverless-express/handler");
const app = require("./app");

const server = handler(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  server.proxy(server, event, context);
};
