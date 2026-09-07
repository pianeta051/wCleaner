import type { APIGatewayProxyHandler } from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import express from "express";

const app = express();
const server = awsServerlessExpress.createServer(app);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("event", event);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
