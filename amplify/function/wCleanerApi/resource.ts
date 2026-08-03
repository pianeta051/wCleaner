import { defineFunction } from "@aws-amplify/backend";
import type { Backend } from "../../backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const wCleanerApi = defineFunction({
  entry: "./index.js",
  name: `wCleanerApi-${branchName}`,
  timeoutSeconds: 25,
  memoryMB: 256,
  environment: {
    ENV: `${branchName}`,
    USER_POOL_ID: "eu-west-2_nlvZhm5ao",
    REGION: "eu-west-2",
  },
  runtime: 24,
});

export function applyEscapeHatches(backend: Backend) {
  backend.wCleanerApi.resources.cfnResources.cfnFunction.functionName = `wCleanerApi-${branchName}`;
}
