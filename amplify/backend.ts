import * as AdminQueries from "./api/AdminQueries/resource";
import * as auth from "./auth/resource";
import * as monitoring from "./custom/monitoring/resource";
// import * as sesEmail from "./custom/sesEmail/resource";
import * as AdminQueries0c37162b from "./function/AdminQueries0c37162b/resource";
import * as storageWcleaner from "./storage/wcleaner/resource";
import * as storage from "./storage/resource";
import { defineBackend } from "@aws-amplify/backend";
import { Tags } from "aws-cdk-lib";

const backend = defineBackend({
  auth: auth.auth,
  AdminQueries0c37162b: AdminQueries0c37162b.AdminQueries0c37162b,
  storage: storage.storage,
});

export type Backend = typeof backend;

const wcleaner = storageWcleaner.defineStorageWcleaner(backend);
AdminQueries.defineAdminQueriesApi(backend);
monitoring.defineMonitoring(backend);
// sesEmail.defineSesEmail(backend);

auth.applyEscapeHatches(backend);
AdminQueries0c37162b.applyEscapeHatches(backend);
storage.applyEscapeHatches(backend);

export function postRefactor() {
  storageWcleaner.postRefactor(wcleaner);
  storage.postRefactor(backend);
  Tags.of(backend.stack).add("gen2-migration/post-refactor", "true");
}

// Uncomment after refactor
// postRefactor();
