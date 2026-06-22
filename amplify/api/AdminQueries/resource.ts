import {
  RestApi,
  LambdaIntegration,
  AuthorizationType,
  Cors,
  ResponseType,
} from 'aws-cdk-lib/aws-apigateway';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import type { Backend } from '../../backend';

const branchName = process.env.AWS_BRANCH ?? 'sandbox';

export function defineAdminQueriesApi(backend: Backend) {
  const stack = backend.createStack('rest-api-stack-AdminQueries');
  const AdminQueriesApi = new RestApi(stack, 'RestApi', {
    restApiName: `AdminQueries-${branchName}`,
  });
  AdminQueriesApi.addGatewayResponse('Default4XX', {
    type: ResponseType.DEFAULT_4XX,
    responseHeaders: {
      'Access-Control-Allow-Origin': "'*'",
      'Access-Control-Allow-Headers':
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      'Access-Control-Allow-Methods':
        "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
      'Access-Control-Expose-Headers': "'Date,X-Amzn-ErrorType'",
    },
  });
  AdminQueriesApi.addGatewayResponse('Default5XX', {
    type: ResponseType.DEFAULT_5XX,
    responseHeaders: {
      'Access-Control-Allow-Origin': "'*'",
      'Access-Control-Allow-Headers':
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      'Access-Control-Allow-Methods':
        "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
      'Access-Control-Expose-Headers': "'Date,X-Amzn-ErrorType'",
    },
  });
  const AdminQueries0c37162bIntegration = new LambdaIntegration(
    backend.AdminQueries0c37162b.resources.lambda
  );
  const gen1AdminQueriesApi = RestApi.fromRestApiAttributes(
    stack,
    'Gen1AdminQueriesApi',
    {
      restApiId: 'jh2jysc3g5',
      rootResourceId: 'psrv7pcrq7',
    }
  );
  const gen1AdminQueriesPolicy = new Policy(stack, 'Gen1AdminQueriesPolicy', {
    statements: [
      new PolicyStatement({
        actions: ['execute-api:Invoke'],
        resources: [
          `${gen1AdminQueriesApi.arnForExecuteApi('POST', '/*')}`,
          `${gen1AdminQueriesApi.arnForExecuteApi('GET', '/*')}`,
          `${gen1AdminQueriesApi.arnForExecuteApi('PUT', '/*')}`,
          `${gen1AdminQueriesApi.arnForExecuteApi('DELETE', '/*')}`,
        ],
      }),
    ],
  });
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    gen1AdminQueriesPolicy
  );
  const root = AdminQueriesApi.root;
  root.addMethod('ANY', AdminQueries0c37162bIntegration);
  root.addProxy({
    anyMethod: true,
    defaultIntegration: AdminQueries0c37162bIntegration,
  });
  // /{proxy+} - all authenticated users
  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
    new Policy(stack, 'proxyAuthPolicy', {
      statements: [
        new PolicyStatement({
          actions: ['execute-api:Invoke'],
          resources: [
            AdminQueriesApi.arnForExecuteApi('POST', '/{proxy+}'),
            AdminQueriesApi.arnForExecuteApi('POST', '/{proxy+}/*'),
            AdminQueriesApi.arnForExecuteApi('GET', '/{proxy+}'),
            AdminQueriesApi.arnForExecuteApi('GET', '/{proxy+}/*'),
            AdminQueriesApi.arnForExecuteApi('PUT', '/{proxy+}'),
            AdminQueriesApi.arnForExecuteApi('PUT', '/{proxy+}/*'),
            AdminQueriesApi.arnForExecuteApi('DELETE', '/{proxy+}'),
            AdminQueriesApi.arnForExecuteApi('DELETE', '/{proxy+}/*'),
          ],
        }),
      ],
    })
  );
  backend.addOutput({
    custom: {
      API: {
        [AdminQueriesApi.restApiName]: {
          endpoint: AdminQueriesApi.url.slice(0, -1),
          region: Stack.of(AdminQueriesApi).region,
          apiName: AdminQueriesApi.restApiName,
        },
      },
    },
  });
}
