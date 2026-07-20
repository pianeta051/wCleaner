import {
  AmplifyApiRestResourceStackTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

const REGION = "eu-west-2";
const ACCOUNT = "295621520330";

export function override(
  resources: AmplifyApiRestResourceStackTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  for (const path in resources.restApi.body.paths) {
    if (resources.policies[path]) {
      // filter out paths that are not added to the policy ({proxy+} for example)
      for (const group in resources.policies[path].groups) {
        setPolicy(path, group, resources);
      }
    }
  }
}

function setPolicy(
  path: string,
  group: string,
  resources: AmplifyApiRestResourceStackTemplate
) {
  const method = "*";
  const wildcardedPath = path.replace(/{[^}]*}/g, "*"); //replace path parameters with *

  resources.policies[path].groups[group].policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "execute-api:Invoke",
        Resource: [
          `arn:aws:execute-api:${REGION}:${ACCOUNT}:${resources.restApi.ref}/${resources.deploymentResource.stageName}/${method}${wildcardedPath}`,
          `arn:aws:execute-api:${REGION}:${ACCOUNT}:${resources.restApi.ref}/${resources.deploymentResource.stageName}/${method}${wildcardedPath}/*`,
        ],
      },
    ],
  };
}
