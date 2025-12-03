import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ses from "aws-cdk-lib/aws-ses";
import * as route53 from "aws-cdk-lib/aws-route53";

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    const domain: string = domainParam.valueAsString;
    const hostedZoneId: string = hostedZoneIdParam.valueAsString;

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
