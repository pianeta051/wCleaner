import {
  RestApi,
  LambdaIntegration,
  AuthorizationType,
  Cors,
  ResponseType,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import type { Backend } from "../../backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export function defineWCleanerApiApi(backend: Backend) {
  const stack = backend.createStack("rest-api-stack-wCleanerApi");
  const wCleanerApiApi = new RestApi(stack, "RestApi", {
    restApiName: `wCleanerApi-${branchName}`,
  });
  wCleanerApiApi.addGatewayResponse("Default4XX", {
    type: ResponseType.DEFAULT_4XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers":
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      "Access-Control-Allow-Methods":
        "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
      "Access-Control-Expose-Headers": "'Date,X-Amzn-ErrorType'",
    },
  });
  wCleanerApiApi.addGatewayResponse("Default5XX", {
    type: ResponseType.DEFAULT_5XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers":
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      "Access-Control-Allow-Methods":
        "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
      "Access-Control-Expose-Headers": "'Date,X-Amzn-ErrorType'",
    },
  });
  const wCleanerApiIntegration = new LambdaIntegration(
    backend.wCleanerApi.resources.lambda
  );
  const gen1wCleanerApiApi = RestApi.fromRestApiAttributes(
    stack,
    "Gen1wCleanerApiApi",
    {
      restApiId: "f7hi5qf3mg",
      rootResourceId: "n44pbm8x3d",
    }
  );
  const gen1wCleanerApiPolicy = new Policy(stack, "Gen1wCleanerApiPolicy", {
    statements: [
      new PolicyStatement({
        actions: ["execute-api:Invoke"],
        resources: [
          `${gen1wCleanerApiApi.arnForExecuteApi("POST", "/*")}`,
          `${gen1wCleanerApiApi.arnForExecuteApi("GET", "/*")}`,
          `${gen1wCleanerApiApi.arnForExecuteApi("PUT", "/*")}`,
          `${gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/*")}`,
        ],
      }),
    ],
  });
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    gen1wCleanerApiPolicy
  );
  const customers = wCleanerApiApi.root.addResource("customers", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  customers.addMethod("ANY", wCleanerApiIntegration);
  customers.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const customerbyid = wCleanerApiApi.root.addResource("customer-by-id", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  customerbyid.addMethod("ANY", wCleanerApiIntegration);
  customerbyid.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const jobs = wCleanerApiApi.root.addResource("jobs", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  jobs.addMethod("ANY", wCleanerApiIntegration);
  jobs.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const jobtype = wCleanerApiApi.root.addResource("job-type", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  jobtype.addMethod("ANY", wCleanerApiIntegration);
  jobtype.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const jobtypes = wCleanerApiApi.root.addResource("job-types", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  jobtypes.addMethod("ANY", wCleanerApiIntegration);
  jobtypes.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const outcodes = wCleanerApiApi.root.addResource("outcodes", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  outcodes.addMethod("ANY", wCleanerApiIntegration);
  outcodes.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  const invoices = wCleanerApiApi.root.addResource("invoices", {
    defaultMethodOptions: {
      authorizationType: AuthorizationType.IAM,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: [
        "Content-Type",
        "X-Amz-Date",
        "Authorization",
        "X-Api-Key",
        "X-Amz-Security-Token",
        "X-Amz-User-Agent",
      ],
      statusCode: 200,
    },
  });
  invoices.addMethod("ANY", wCleanerApiIntegration);
  invoices.addProxy({
    anyMethod: true,
    defaultIntegration: wCleanerApiIntegration,
  });
  // /customers - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "customersAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/customers"),
            wCleanerApiApi.arnForExecuteApi("*", "/customers/*"),
        }),
      ],
    })
  );
  // /customers - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "adminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1AdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("*", "*"),
          ],
        }),
      ],
    })
  );
  // /customer-by-id - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "customerbyidAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("*", "/customer-by-id/*"),
          ],
        }),
      ],
    })
  );
  // /jobs - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "jobsAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("*", "/jobs/*"),
          ],
        }),
      ],
    })
  );
  // /job-type - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "jobtypeAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("*", "/job-type/*"),
          ],
        }),
      ],
    })
  );
  // /job-types - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "jobtypesAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("*", "/job-types/*"),
          ],
        }),
      ],
    })
  );
  // /outcodes - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "outcodesAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("*", "/outcodes/*"),
          ],
        }),
      ],
    })
  );
  // /invoices - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, "invoicesAuthPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("*", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("*", "/invoices/*"),
          ],
        }),
      ],
    })
  );
  backend.addOutput({
    custom: {
      API: {
        [wCleanerApiApi.restApiName]: {
          endpoint: wCleanerApiApi.url.slice(0, -1),
          region: Stack.of(wCleanerApiApi).region,
          apiName: wCleanerApiApi.restApiName,
        },
      },
    },
  });
}
