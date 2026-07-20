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
            wCleanerApiApi.arnForExecuteApi("POST", "/customers"),
            wCleanerApiApi.arnForExecuteApi("POST", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customers"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customers"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customers"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customers/*"),
          ],
        }),
      ],
    })
  );
  // /customers - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "customersAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/customers"),
            wCleanerApiApi.arnForExecuteApi("POST", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customers"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customers"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customers/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customers"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customers/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1CustomersAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/customers"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/customers/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/customers"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/customers/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/customers"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/customers/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/customers"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/customers/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id/*"),
          ],
        }),
      ],
    })
  );
  // /customer-by-id - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "customerbyidAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1CustomerbyidAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/customer-by-id/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/customer-by-id/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/customer-by-id/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/customer-by-id/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("POST", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("GET", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs/*"),
          ],
        }),
      ],
    })
  );
  // /jobs - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "jobsAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("POST", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("GET", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/jobs/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1JobsAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/jobs"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/jobs/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/jobs"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/jobs/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/jobs"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/jobs/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/jobs/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("POST", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type/*"),
          ],
        }),
      ],
    })
  );
  // /job-type - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "jobtypeAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("POST", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-type/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1JobtypeAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/job-type"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/job-type/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/job-type"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/job-type/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/job-type"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/job-type/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/job-type/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("POST", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types/*"),
          ],
        }),
      ],
    })
  );
  // /job-types - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "jobtypesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("POST", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("GET", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/job-types/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1JobtypesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/job-types"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/job-types/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/job-types"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/job-types/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/job-types"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/job-types/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/job-types/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("POST", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("GET", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes/*"),
          ],
        }),
      ],
    })
  );
  // /outcodes - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "outcodesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("POST", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("GET", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1OutcodesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/outcodes"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/outcodes/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/outcodes"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/outcodes/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/outcodes/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/outcodes/*"),
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
            wCleanerApiApi.arnForExecuteApi("POST", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("POST", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("GET", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices/*"),
          ],
        }),
      ],
    })
  );
  // /invoices - Admin group only
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "invoicesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            wCleanerApiApi.arnForExecuteApi("POST", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("POST", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("GET", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("GET", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("PUT", "/invoices/*"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices"),
            wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices/*"),
          ],
        }),
      ],
    })
  );
  backend.auth.resources.groups["Admin"].role.attachInlinePolicy(
    new Policy(stack, "gen1InvoicesAdminPolicy", {
      statements: [
        new PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: [
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/invoices"),
            gen1wCleanerApiApi.arnForExecuteApi("POST", "/invoices/*"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/invoices"),
            gen1wCleanerApiApi.arnForExecuteApi("GET", "/invoices/*"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/invoices"),
            gen1wCleanerApiApi.arnForExecuteApi("PUT", "/invoices/*"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices"),
            gen1wCleanerApiApi.arnForExecuteApi("DELETE", "/invoices/*"),
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
