import { config } from "../../config";
import { amplifyClient } from "./amplifyClient";
import { AuthClient } from "./types";

const selectClient = (): AuthClient => {
  if (config.switchToNewInfra) {
    throw new Error(
      "VITE_SWITCH_TO_NEW_INFRA is set, but the new auth client is not implemented yet."
    );
  }
  return amplifyClient;
};

export const authClient = selectClient();
export type { AuthClient, CognitoUserWithAttributes } from "./types";
