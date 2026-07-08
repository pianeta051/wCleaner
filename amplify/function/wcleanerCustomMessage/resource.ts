import { defineFunction } from "@aws-amplify/backend";
import type { Backend } from "../../backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const wcleanerCustomMessage = defineFunction({
  entry: "./index.js",
  name: `wcleanerCustomMessage-${branchName}`,
  timeoutSeconds: 25,
  memoryMB: 128,
  environment: {
    EMAILSUBJECT: "",
    MODULES: "custom",
    REDIRECTURL: "",
    RESOURCENAME: "wcleanerCustomMessage",
    REDIRECT_TO: "https://develop.d2r3wluo8x2tk9.amplifyapp.com",
    ENV: `${branchName}`,
    EMAILMESSAGE: "",
    REGION: "eu-west-2",
  },
  runtime: 24,
});

export function applyEscapeHatches(backend: Backend) {
  backend.wcleanerCustomMessage.resources.cfnResources.cfnFunction.functionName = `wcleanerCustomMessage-${branchName}`;
}
