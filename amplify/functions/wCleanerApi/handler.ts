import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

export const handler = async (event, context) => {
  console.log("event", event);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
