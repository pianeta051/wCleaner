import { CognitoApi, CognitoApiError } from "./cognitoApi";
import { TokenStore, Tokens } from "./tokenStore";
import { AuthClient, CognitoUserWithAttributes } from "./types";

const REFRESH_MARGIN_MS = 60 * 1000;

const REFRESH_REJECTED = new Set([
  "NotAuthorizedException",
  "UserNotFoundException",
  "PasswordResetRequiredException",
  "UserNotConfirmedException",
]);

type AuthenticationResult = {
  AccessToken: string;
  IdToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
};

type AuthResponse = {
  AuthenticationResult?: AuthenticationResult;
  ChallengeName?: string;
  ChallengeParameters?: Record<string, string>;
  Session?: string;
};

type GetUserResponse = {
  UserAttributes: { Name: string; Value: string }[];
};

const errorWithName = (name: string, message: string) =>
  Object.assign(new Error(message), { name });

const notAuthenticated = () =>
  errorWithName("NotAuthorizedException", "User is not authenticated");

const decodePayload = (token: string): Record<string, unknown> => {
  const payload = token.split(".")[1] ?? "";
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

export const createCognitoClient = ({
  api,
  store,
  clientId,
  now = Date.now,
}: {
  api: CognitoApi;
  store: TokenStore;
  clientId: string;
  now?: () => number;
}): AuthClient => {
  let refreshing: Promise<Tokens> | null = null;

  const toTokens = (
    result: AuthenticationResult,
    previousRefreshToken?: string
  ): Tokens => {
    const refreshToken = result.RefreshToken ?? previousRefreshToken;
    if (!refreshToken) {
      throw errorWithName("InternalErrorException", "No refresh token");
    }
    return {
      idToken: result.IdToken,
      accessToken: result.AccessToken,
      refreshToken,
      expiresAt: now() + result.ExpiresIn * 1000,
    };
  };

  const refresh = async (current: Tokens): Promise<Tokens> => {
    try {
      const response = await api.call<AuthResponse>("InitiateAuth", {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: clientId,
        AuthParameters: { REFRESH_TOKEN: current.refreshToken },
      });
      if (!response.AuthenticationResult) {
        throw errorWithName("NotAuthorizedException", "Refresh failed");
      }
      const tokens = toTokens(
        response.AuthenticationResult,
        current.refreshToken
      );
      store.setTokens(tokens);
      return tokens;
    } catch (error) {
      if (
        error instanceof CognitoApiError &&
        REFRESH_REJECTED.has(error.name)
      ) {
        store.clearTokens();
      }
      throw error;
    }
  };

  // One refresh at a time: concurrent callers share the same request.
  const validTokens = async (): Promise<Tokens | null> => {
    const tokens = store.getTokens();
    if (!tokens) {
      return null;
    }
    if (tokens.expiresAt - now() > REFRESH_MARGIN_MS) {
      return tokens;
    }
    if (!refreshing) {
      refreshing = refresh(tokens).finally(() => {
        refreshing = null;
      });
    }
    return refreshing;
  };

  const requireAccessToken = async (): Promise<string> => {
    const tokens = await validTokens();
    if (!tokens) {
      throw notAuthenticated();
    }
    return tokens.accessToken;
  };

  return {
    async signIn(email, password) {
      const response = await api.call<AuthResponse>("InitiateAuth", {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      });
      if (response.AuthenticationResult) {
        store.setTokens(toTokens(response.AuthenticationResult));
        store.clearChallenge();
        return "DONE";
      }
      if (
        response.ChallengeName === "NEW_PASSWORD_REQUIRED" &&
        response.Session
      ) {
        store.setChallenge({
          session: response.Session,
          username: response.ChallengeParameters?.USER_ID_FOR_SRP ?? email,
        });
        return "NEW_PASSWORD_REQUIRED";
      }
      throw errorWithName(
        "UnsupportedChallengeException",
        `Unsupported challenge: ${response.ChallengeName}`
      );
    },

    async completeNewPassword(newPassword) {
      const challenge = store.getChallenge();
      if (!challenge) {
        throw errorWithName("NoChallengeException", "No sign-in in progress");
      }
      // The challenge is kept if this fails (e.g. the password is rejected),
      // so the user can try again until the session expires.
      const response = await api.call<AuthResponse>("RespondToAuthChallenge", {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: clientId,
        Session: challenge.session,
        ChallengeResponses: {
          USERNAME: challenge.username,
          NEW_PASSWORD: newPassword,
        },
      });
      if (!response.AuthenticationResult) {
        throw errorWithName(
          "UnsupportedChallengeException",
          `Unsupported challenge: ${response.ChallengeName}`
        );
      }
      store.setTokens(toTokens(response.AuthenticationResult));
      store.clearChallenge();
    },

    async signOut() {
      const tokens = store.getTokens();
      try {
        if (tokens) {
          await api.call("RevokeToken", {
            ClientId: clientId,
            Token: tokens.refreshToken,
          });
        }
      } catch {
        // Offline or already revoked: the user is signed out locally anyway.
      } finally {
        store.clearTokens();
        store.clearChallenge();
      }
    },

    async getCurrentUser() {
      const tokens = await validTokens();
      if (!tokens) {
        return null;
      }
      const { UserAttributes } = await api.call<GetUserResponse>("GetUser", {
        AccessToken: tokens.accessToken,
      });
      // The backend is the one that verifies tokens; here we only read claims.
      const claims = decodePayload(tokens.accessToken);
      const user: CognitoUserWithAttributes = {
        username: String(claims.username),
        userId: String(claims.sub),
        attributes: Object.fromEntries(
          UserAttributes.map(({ Name, Value }) => [Name, Value])
        ),
        groups: (claims["cognito:groups"] as string[] | undefined) ?? [],
      };
      return user;
    },

    async getAccessToken() {
      const tokens = await validTokens();
      return tokens?.accessToken ?? null;
    },

    async forgotPassword(email, redirectTo) {
      await api.call("ForgotPassword", {
        ClientId: clientId,
        Username: email,
        // The CustomMessage function reads the link's origin from here. Left
        // out when empty: it'd be ignored (with a warning) anyway.
        ...(redirectTo && { ClientMetadata: { redirectTo } }),
      });
    },

    async confirmForgotPassword(email, code, newPassword) {
      await api.call("ConfirmForgotPassword", {
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });
    },

    async updateAttributes(attributes) {
      await api.call("UpdateUserAttributes", {
        AccessToken: await requireAccessToken(),
        UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({
          Name,
          Value,
        })),
      });
    },

    async changePassword(oldPassword, newPassword) {
      await api.call("ChangePassword", {
        AccessToken: await requireAccessToken(),
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword,
      });
    },
  };
};
