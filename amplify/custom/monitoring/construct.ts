import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Backend } from "../../backend";
const branchName = process.env.AWS_BRANCH ?? "sandbox";
const projectName = "wCleaner";
export class Monitoring extends Construct {
  constructor(scope: Construct, id: string, backend: Backend) {
    super(scope, id);
    const bucket = new s3.Bucket(this, "carlos-bucket-para-borrar-forever");
    // const isDevCondition = new cdk.CfnCondition(this, "IsDevEnvironment", {
    //   expression: cdk.Fn.conditionEquals(envParameter, "dev"),
    // });
    // // Get the API IDs and Deployment IDs from the dependencies
    // const wCleanerApiId = backend.data.resources.ApiId;
    // const wCleanerApiDeploymentId = backend.data.resources.DeploymentId;
    // // ===========================================
    // // CloudWatch Log Groups for API Gateway access logs
    // // ===========================================
    // const wCleanerApiAccessLogGroup = new logs.LogGroup(
    //   this,
    //   "WCleanerApiAccessLogs",
    //   {
    //     logGroupName: `/aws/apigateway/${projectName}-api-wcleanerApi-${branchName}`,
    //     retention: logs.RetentionDays.ONE_WEEK,
    //     removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   }
    // );
    // // ===========================================
    // // IAM Role for API Gateway CloudWatch logging
    // // ===========================================
    // const apiGatewayLogsRole = new iam.Role(this, "ApiGatewayLogsRole", {
    //   assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName(
    //       "service-role/AmazonAPIGatewayPushToCloudWatchLogs"
    //     ),
    //   ],
    // });
    // // ===========================================
    // // API Gateway Account configuration (region singleton)
    // // Links the IAM role to API Gateway at the account level.
    // // Note: Only one AWS::ApiGateway::Account can exist per region.
    // // First deployment per region creates it; if another stack owns it,
    // // manually configure via API Gateway console → Settings.
    // // ===========================================
    // const apiGatewayAccount = new apigateway.CfnAccount(
    //   this,
    //   "ApiGatewayAccount",
    //   {
    //     cloudWatchRoleArn: apiGatewayLogsRole.roleArn,
    //   }
    // );
    // apiGatewayAccount.cfnOptions.condition = isDevCondition;
    // // Access log format
    // const accessLogFormat = JSON.stringify({
    //   requestId: "$context.requestId",
    //   extendedRequestId: "$context.extendedRequestId",
    //   ip: "$context.identity.sourceIp",
    //   caller: "$context.identity.caller",
    //   user: "$context.identity.user",
    //   requestTime: "$context.requestTime",
    //   httpMethod: "$context.httpMethod",
    //   resourcePath: "$context.resourcePath",
    //   path: "$context.path",
    //   status: "$context.status",
    //   protocol: "$context.protocol",
    //   responseLength: "$context.responseLength",
    //   responseLatency: "$context.responseLatency",
    //   integrationLatency: "$context.integrationLatency",
    //   integrationStatus: "$context.integrationStatus",
    //   errorMessage: "$context.error.message",
    //   errorType: "$context.error.responseType",
    // });
    // // Method settings
    // const methodSettings = [
    //   {
    //     httpMethod: "*",
    //     resourcePath: "/*",
    //     metricsEnabled: true,
    //     dataTraceEnabled: true,
    //     loggingLevel: "INFO",
    //   },
    // ];
    // // ===========================================
    // // WCleanerApi Stage    // ===========================================
    // const wCleanerApiStage = new apigateway.CfnStage(this, "WCleanerApiStage", {
    //   restApiId: wCleanerApiId,
    //   deploymentId: wCleanerApiDeploymentId,
    //   stageName: branchName,
    //   accessLogSetting: {
    //     destinationArn: wCleanerApiAccessLogGroup.logGroupArn,
    //     format: accessLogFormat,
    //   },
    //   tracingEnabled: true,
    //   methodSettings: methodSettings,
    // });
  }
}
