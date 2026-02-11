import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import { AmplifyDependentResourcesAttributes } from "../../types/amplify-dependent-resources-ref";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    const envParameter = new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    const isDevCondition = new cdk.CfnCondition(this, "IsDevEnvironment", {
      expression: cdk.Fn.conditionEquals(envParameter, "dev"),
    });

    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();

    const dependencies: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps!.category,
        amplifyResourceProps!.resourceName,
        [{ category: "api", resourceName: "wCleanerApi" }]
      );

    // Get the API IDs and Deployment IDs from the dependencies
    const wCleanerApiId = cdk.Fn.ref(dependencies.api.wCleanerApi.ApiId);
    const wCleanerApiDeploymentId = cdk.Fn.ref(
      dependencies.api.wCleanerApi.DeploymentId
    );

    // ===========================================
    // CloudWatch Log Groups for API Gateway access logs
    // ===========================================
    const wCleanerApiAccessLogGroup = new logs.LogGroup(
      this,
      "WCleanerApiAccessLogs",
      {
        logGroupName: `/aws/apigateway/${
          amplifyProjectInfo.projectName
        }-api-wcleanerApi-${cdk.Fn.ref("env")}`,
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    // ===========================================
    // IAM Role for API Gateway CloudWatch logging
    // ===========================================
    const apiGatewayLogsRole = new iam.Role(this, "ApiGatewayLogsRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonAPIGatewayPushToCloudWatchLogs"
        ),
      ],
    });

    // ===========================================
    // API Gateway Account configuration (region singleton)
    // Links the IAM role to API Gateway at the account level.
    // Note: Only one AWS::ApiGateway::Account can exist per region.
    // First deployment per region creates it; if another stack owns it,
    // manually configure via API Gateway console → Settings.
    // ===========================================
    const apiGatewayAccount = new apigateway.CfnAccount(
      this,
      "ApiGatewayAccount",
      {
        cloudWatchRoleArn: apiGatewayLogsRole.roleArn,
      }
    );

    apiGatewayAccount.cfnOptions.condition = isDevCondition;

    // Access log format
    const accessLogFormat = JSON.stringify({
      requestId: "$context.requestId",
      extendedRequestId: "$context.extendedRequestId",
      ip: "$context.identity.sourceIp",
      caller: "$context.identity.caller",
      user: "$context.identity.user",
      requestTime: "$context.requestTime",
      httpMethod: "$context.httpMethod",
      resourcePath: "$context.resourcePath",
      path: "$context.path",
      status: "$context.status",
      protocol: "$context.protocol",
      responseLength: "$context.responseLength",
      responseLatency: "$context.responseLatency",
      integrationLatency: "$context.integrationLatency",
      integrationStatus: "$context.integrationStatus",
      errorMessage: "$context.error.message",
      errorType: "$context.error.responseType",
    });

    // Method settings
    const methodSettings = [
      {
        httpMethod: "*",
        resourcePath: "/*",
        metricsEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: "INFO",
      },
    ];

    // ===========================================
    // WCleanerApi Stage    // ===========================================
    const wCleanerApiStage = new apigateway.CfnStage(this, "WCleanerApiStage", {
      restApiId: wCleanerApiId,
      deploymentId: wCleanerApiDeploymentId,
      stageName: cdk.Fn.ref("env"),
      accessLogSetting: {
        destinationArn: wCleanerApiAccessLogGroup.logGroupArn,
        format: accessLogFormat,
      },
      tracingEnabled: true,
      methodSettings: methodSettings,
    });
    wCleanerApiStage.addDependency(apiGatewayAccount);
  }
}
