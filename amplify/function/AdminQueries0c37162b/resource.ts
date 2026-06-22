import { defineFunction } from '@aws-amplify/backend';
import type { Backend } from '../../backend';

const branchName = process.env.AWS_BRANCH ?? 'sandbox';

export const AdminQueries0c37162b = defineFunction({
  entry: './index.js',
  name: `AdminQueries0c37162b-${branchName}`,
  timeoutSeconds: 25,
  memoryMB: 128,
  environment: {
    GROUP: 'Admin',
    USERPOOL: 'eu-west-2_nlvZhm5ao',
    ENV: `${branchName}`,
  },
  runtime: 24,
});

export function applyEscapeHatches(backend: Backend) {
  backend.AdminQueries0c37162b.resources.cfnResources.cfnFunction.functionName = `AdminQueries0c37162b-${branchName}`;
}
