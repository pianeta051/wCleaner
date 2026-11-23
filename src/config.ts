// Build-time configuration. Vite replaces `import.meta.env.VITE_*` when building.
//
// `VITE_SWITCH_TO_NEW_INFRA=true` switches the app from Amplify to our own
// infrastructure. Anything else (absent, empty, "false"...) keeps Amplify.

export type CognitoConfig = {
  userPoolId: string;
  clientId: string;
  region: string;
};

export type Config = {
  switchToNewInfra: boolean;
  // Only set when `switchToNewInfra` is true.
  cognito?: CognitoConfig;
};

type Env = Record<string, string | undefined>;

export const readConfig = (env: Env): Config => {
  if (env.VITE_SWITCH_TO_NEW_INFRA !== "true") {
    return { switchToNewInfra: false };
  }
  const userPoolId = env.VITE_COGNITO_USER_POOL_ID;
  const clientId = env.VITE_COGNITO_CLIENT_ID;
  const missing = [
    !userPoolId && "VITE_COGNITO_USER_POOL_ID",
    !clientId && "VITE_COGNITO_CLIENT_ID",
  ].filter(Boolean);
  if (!userPoolId || !clientId) {
    throw new Error(
      `VITE_SWITCH_TO_NEW_INFRA is true, but ${missing.join(" and ")} ${
        missing.length > 1 ? "are" : "is"
      } not set.`
    );
  }
  // Pool IDs look like `eu-west-2_AbC123`: the region is the part before `_`.
  const region = userPoolId.split("_")[0];
  if (!region || region === userPoolId) {
    throw new Error(
      `VITE_COGNITO_USER_POOL_ID "${userPoolId}" is not valid (expected <region>_<id>).`
    );
  }
  return {
    switchToNewInfra: true,
    cognito: { userPoolId, clientId, region },
  };
};

export const config = readConfig(import.meta.env);
