import express from "express";
import bodyParser from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";

const MANDATORY_ENV_VARS = ["USER_POOL_ID", "ENV"];

const checkEnvVars = () => {
  const missingEnvVars = [];
  for (const envVar of MANDATORY_ENV_VARS) {
    if (process.env[envVar] === undefined) {
      missingEnvVars.push(envVar);
    }
  }
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required env vars: ${missingEnvVars.join(", ")}`);
  }
};

checkEnvVars();

const app = express();
app.use(bodyParser.json());
//app.use(awsServerlessExpressMiddleware.eventContext());

const APP_PORT = process.env.APP_PORT ?? 3000;

app.listen(APP_PORT, function () {
  console.log("App started");
});

app.use(async function (req, res, next) {
  //req.authData = await getAuthData(req);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

export default app;
