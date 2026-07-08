import type { Backend } from "../../backend";
import {
  Table,
  AttributeType,
  BillingMode,
  StreamViewType,
  CfnTable,
} from "aws-cdk-lib/aws-dynamodb";
import { CfnResource } from "aws-cdk-lib";

export function defineStorageWcleaner(backend: Backend) {
  const storageWcleanerStack = backend.createStack("storagewcleaner");
  const wcleaner = new Table(storageWcleanerStack, "wcleaner", {
    partitionKey: { name: "PK", type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
    stream: StreamViewType.NEW_IMAGE,
    sortKey: { name: "SK", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "job_type_color",
    partitionKey: { name: "color", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "customer_slug",
    partitionKey: { name: "slug", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "customer_email",
    partitionKey: { name: "email", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "job_type_name",
    partitionKey: { name: "name_lowercase", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "job_start_time",
    partitionKey: { name: "job_start_time_pk", type: AttributeType.NUMBER },
    sortKey: { name: "start", type: AttributeType.NUMBER },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "invoice_number",
    partitionKey: { name: "job_invoice_pk", type: AttributeType.NUMBER },
    sortKey: { name: "invoice_number", type: AttributeType.NUMBER },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "job_type_id",
    partitionKey: { name: "job_type_id", type: AttributeType.STRING },
  });
  wcleaner.addGlobalSecondaryIndex({
    indexName: "invoice_date",
    partitionKey: { name: "job_invoice_pk", type: AttributeType.NUMBER },
    sortKey: { name: "invoice_date", type: AttributeType.NUMBER },
  });
  for (const cfnResource of storageWcleanerStack.node
    .findAll()
    .filter(
      (c) =>
        CfnResource.isCfnResource(c) &&
        c.cfnResourceType === "AWS::DynamoDB::Table"
    )) {
    (cfnResource as CfnResource).addOverride("UpdateReplacePolicy", "Retain");
    (cfnResource as CfnResource).addOverride("DeletionPolicy", "Retain");
  }
  return wcleaner;
}

export function postRefactor(wcleaner: Table) {
  (wcleaner.node.defaultChild as CfnTable).tableName = "wcleaner-migration";
}
