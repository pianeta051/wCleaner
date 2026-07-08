"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdkStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const AmplifyHelpers = __importStar(require("@aws-amplify/cli-extensibility-helper"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const logs = __importStar(require("aws-cdk-lib/aws-logs"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
class cdkStack extends cdk.Stack {
    constructor(scope, id, props, amplifyResourceProps) {
        super(scope, id, props);
        const envParameter = new cdk.CfnParameter(this, "env", {
            type: "String",
            description: "Current Amplify CLI env name",
        });
        const isDevCondition = new cdk.CfnCondition(this, "IsDevEnvironment", {
            expression: cdk.Fn.conditionEquals(envParameter, "dev"),
        });
        const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
        const dependencies = AmplifyHelpers.addResourceDependency(this, amplifyResourceProps.category, amplifyResourceProps.resourceName, [{ category: "api", resourceName: "wCleanerApi" }]);
        // Get the API IDs and Deployment IDs from the dependencies
        const wCleanerApiId = cdk.Fn.ref(dependencies.api.wCleanerApi.ApiId);
        const wCleanerApiDeploymentId = cdk.Fn.ref(dependencies.api.wCleanerApi.DeploymentId);
        // ===========================================
        // CloudWatch Log Groups for API Gateway access logs
        // ===========================================
        const wCleanerApiAccessLogGroup = new logs.LogGroup(this, "WCleanerApiAccessLogs", {
            logGroupName: `/aws/apigateway/${amplifyProjectInfo.projectName}-api-wcleanerApi-${cdk.Fn.ref("env")}`,
            retention: logs.RetentionDays.ONE_WEEK,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // ===========================================
        // IAM Role for API Gateway CloudWatch logging
        // ===========================================
        const apiGatewayLogsRole = new iam.Role(this, "ApiGatewayLogsRole", {
            assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonAPIGatewayPushToCloudWatchLogs"),
            ],
        });
        // ===========================================
        // API Gateway Account configuration (region singleton)
        // Links the IAM role to API Gateway at the account level.
        // Note: Only one AWS::ApiGateway::Account can exist per region.
        // First deployment per region creates it; if another stack owns it,
        // manually configure via API Gateway console → Settings.
        // ===========================================
        const apiGatewayAccount = new apigateway.CfnAccount(this, "ApiGatewayAccount", {
            cloudWatchRoleArn: apiGatewayLogsRole.roleArn,
        });
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
    }
}
exports.cdkStack = cdkStack;
