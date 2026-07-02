import {
  AmplifyDDBResourceTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";
import { CfnTable } from "aws-cdk-lib/aws-dynamodb";

export function override(
  resources: AmplifyDDBResourceTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  resources.dynamoDBTable.provisionedThroughput = undefined;
  resources.dynamoDBTable.billingMode = "PAY_PER_REQUEST";
  const indexes = resources.dynamoDBTable.globalSecondaryIndexes;
  if (Array.isArray(indexes)) {
    const newIndexes = indexes.map((index) => {
      if (
        (index as CfnTable.GlobalSecondaryIndexProperty).provisionedThroughput
      ) {
        (index as CfnTable.GlobalSecondaryIndexProperty).provisionedThroughput =
          undefined;
      }

      return index;
    });
    resources.dynamoDBTable.globalSecondaryIndexes = newIndexes;
  }
}
