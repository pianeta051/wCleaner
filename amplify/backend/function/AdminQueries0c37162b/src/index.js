/* eslint-disable */
const awsServerlessExpress = require("aws-serverless-express");
const app = require("./app");

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

export async function handler(event, context) {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
}
