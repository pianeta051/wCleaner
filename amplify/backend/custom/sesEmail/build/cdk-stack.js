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
const ses = __importStar(require("aws-cdk-lib/aws-ses"));
const route53 = __importStar(require("aws-cdk-lib/aws-route53"));
class cdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
        const envParameter = new cdk.CfnParameter(this, "env", {
            type: "String",
            description: "Current Amplify CLI env name",
        });
        const domainParam = new cdk.CfnParameter(this, "Domain", {
            type: "String",
        });
        const hostedZoneIdParam = new cdk.CfnParameter(this, "HostedZoneId", {
            type: "String",
        });
        const isDevCondition = new cdk.CfnCondition(this, "IsDevEnvironment", {
            expression: cdk.Fn.conditionEquals(envParameter, "dev"),
        });
        const domain = domainParam.valueAsString;
        const hostedZoneId = hostedZoneIdParam.valueAsString;
        const identity = new ses.CfnEmailIdentity(this, "DomainIdentity", {
            emailIdentity: domain,
            dkimAttributes: { signingEnabled: true },
        });
        identity.cfnOptions.condition = isDevCondition;
        const recordset1 = new route53.CfnRecordSet(this, "Dkim1", {
            hostedZoneId,
            name: identity.attrDkimDnsTokenName1,
            type: "CNAME",
            ttl: "300",
            resourceRecords: [identity.attrDkimDnsTokenValue1],
        });
        recordset1.cfnOptions.condition = isDevCondition;
        const recordset2 = new route53.CfnRecordSet(this, "Dkim2", {
            hostedZoneId,
            name: identity.attrDkimDnsTokenName2,
            type: "CNAME",
            ttl: "300",
            resourceRecords: [identity.attrDkimDnsTokenValue2],
        });
        recordset2.cfnOptions.condition = isDevCondition;
        const recordset3 = new route53.CfnRecordSet(this, "Dkim3", {
            hostedZoneId,
            name: identity.attrDkimDnsTokenName3,
            type: "CNAME",
            ttl: "300",
            resourceRecords: [identity.attrDkimDnsTokenValue3],
        });
        recordset3.cfnOptions.condition = isDevCondition;
    }
}
exports.cdkStack = cdkStack;
