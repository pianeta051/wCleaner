"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.override = void 0;
function override(resources, _amplifyProjectInfo) {
    // Remove the StageName from the deployment to prevent automatic stage creation.
    // The stage will be created in custom/monitoring with proper monitoring config.
    delete resources.deploymentResource.stageName;
    // Export the DeploymentId so it can be referenced from other stacks
    resources.addCfnOutput({
        value: resources.deploymentResource.ref,
        description: "API Gateway Deployment ID",
    }, "DeploymentId");
}
exports.override = override;
