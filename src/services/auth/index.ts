import { config } from "../../config";
import { amplifyClient } from "./amplifyClient";
import { createCognitoApi } from "./cognitoApi";
import { createCognitoClient } from "./cognitoClient";
import { createTokenStore } from "./tokenStore";
import { AuthClient } from "./types";

const selectClient = (): AuthClient => {
  if (!config.cognito) {
    return amplifyClient;
  }
  return createCognitoClient({
    api: createCognitoApi({ region: config.cognito.region }),
    store: createTokenStore({
      persistent: window.localStorage,
      session: window.sessionStorage,
    }),
    clientId: config.cognito.clientId,
  });
};

export const authClient = selectClient();
export type { AuthClient, CognitoUserWithAttributes } from "./types";
