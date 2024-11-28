import {
  AmplifyDDBResourceTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
  resources: AmplifyDDBResourceTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  resources.dynamoDBTable.provisionedThroughput = undefined;
  resources.dynamoDBTable.billingMode = "PAY_PER_REQUEST";
  const indexes = resources.dynamoDBTable.globalSecondaryIndexes;
  if (Array.isArray(indexes)) {
    const newIndexes = indexes.map((index) => {
      if ((index as any).provisionedThroughput) {
        (index as any).provisionedThroughput = undefined;
      }

      return index;
    });
    resources.dynamoDBTable.globalSecondaryIndexes = newIndexes;
  }
}
