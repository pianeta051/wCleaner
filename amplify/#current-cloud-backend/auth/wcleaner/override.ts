import {
  AmplifyAuthCognitoStackTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
  resources: AmplifyAuthCognitoStackTemplate,
  _amplifyProjectInfo: AmplifyProjectInfo
) {
  const customAttribute = {
    attributeDataType: "String",
    developerOnlyAttribute: false,
    mutable: true,
    name: "color",
    required: false,
  };

  const email = {
    mutable: true,
    name: "email",
    required: true,
  };

  resources.userPool.schema = [customAttribute, email];
}
