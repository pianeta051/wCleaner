// This file is used to override the REST API resources configuration
import {
  AmplifyApiRestResourceStackTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
  resources: AmplifyApiRestResourceStackTemplate,
  _amplifyProjectInfo: AmplifyProjectInfo
) {
  // Remove the StageName from the deployment to prevent automatic stage creation.
  // The stage will be created in custom/monitoring with proper monitoring config.
  delete resources.deploymentResource.stageName;

  // Export the DeploymentId so it can be referenced from other stacks
  resources.addCfnOutput(
    {
      value: resources.deploymentResource.ref,
      description: "API Gateway Deployment ID",
    },
    "DeploymentId"
  );
}
