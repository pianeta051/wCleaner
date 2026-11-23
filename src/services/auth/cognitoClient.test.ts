import { beforeEach, describe, expect, it, vi } from "vitest";
import { CognitoApi, CognitoApiError } from "./cognitoApi";
import { createCognitoClient } from "./cognitoClient";
import { createTokenStore, StorageLike } from "./tokenStore";
import { AuthClient } from "./types";

const CLIENT_ID = "client-id";
const NOW = 1_700_000_000_000;

const memoryStorage = (): StorageLike & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
};

const jwt = (payload: Record<string, unknown>) => {
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return `${encode({ alg: "none" })}.${encode(payload)}.signature`;
};

const authResult = (overrides = {}) => ({
  AuthenticationResult: {
    AccessToken: jwt({ username: "user-sub", sub: "user-sub" }),
    IdToken: "id-token",
    RefreshToken: "refresh-token",
    ExpiresIn: 3600,
    ...overrides,
  },
});

const cognitoError = (name: string, message = "", status = 400) =>
  new CognitoApiError(name, message, status);

describe("cognitoClient", () => {
  let time: number;
  let call: ReturnType<typeof vi.fn>;
  let persistent: ReturnType<typeof memoryStorage>;
  let session: ReturnType<typeof memoryStorage>;
  let client: AuthClient;

  const setUp = () => {
    persistent = memoryStorage();
    session = memoryStorage();
    call = vi.fn();
    client = createCognitoClient({
      api: { call } as unknown as CognitoApi,
      store: createTokenStore({ persistent, session }),
      clientId: CLIENT_ID,
      now: () => time,
    });
  };

  const storedTokens = () => JSON.parse(persistent.data.get("wcleaner.auth")!);

  const signedIn = async (result = authResult()) => {
    call.mockResolvedValueOnce(result);
    await client.signIn("user@email.com", "Password1!");
    call.mockClear();
  };

  beforeEach(() => {
    time = NOW;
    setUp();
  });

  describe("signIn", () => {
    it("calls InitiateAuth with USER_PASSWORD_AUTH and stores the tokens", async () => {
      call.mockResolvedValueOnce(authResult());

      const result = await client.signIn("user@email.com", "Password1!");

      expect(result).toBe("DONE");
      expect(call).toHaveBeenCalledWith("InitiateAuth", {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: "user@email.com", PASSWORD: "Password1!" },
      });
      expect(storedTokens()).toEqual({
        idToken: "id-token",
        accessToken: expect.any(String),
        refreshToken: "refresh-token",
        expiresAt: NOW + 3600 * 1000,
      });
    });

    it("keeps the challenge when a new password is required", async () => {
      call.mockResolvedValueOnce({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: "session-1",
        ChallengeParameters: { USER_ID_FOR_SRP: "user-sub" },
      });

      const result = await client.signIn("user@email.com", "Temp1234!");

      expect(result).toBe("NEW_PASSWORD_REQUIRED");
      expect(persistent.data.size).toBe(0);
      expect(JSON.parse(session.data.get("wcleaner.auth.challenge")!)).toEqual({
        session: "session-1",
        username: "user-sub",
      });
    });

    it("rejects challenges it can't answer", async () => {
      call.mockResolvedValueOnce({
        ChallengeName: "SMS_MFA",
        Session: "session-1",
      });

      await expect(client.signIn("a@b.co", "pw")).rejects.toMatchObject({
        name: "UnsupportedChallengeException",
      });
    });

    it("passes Cognito's errors through with their name and message", async () => {
      call.mockRejectedValueOnce(
        cognitoError("NotAuthorizedException", "Password attempts exceeded")
      );

      await expect(client.signIn("a@b.co", "pw")).rejects.toMatchObject({
        name: "NotAuthorizedException",
        message: "Password attempts exceeded",
      });
      expect(persistent.data.size).toBe(0);
    });
  });

  describe("completeNewPassword", () => {
    const startChallenge = async () => {
      call.mockResolvedValueOnce({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: "session-1",
        ChallengeParameters: { USER_ID_FOR_SRP: "user-sub" },
      });
      await client.signIn("user@email.com", "Temp1234!");
      call.mockClear();
    };

    it("answers the stored challenge, signs in and clears the challenge", async () => {
      await startChallenge();
      call.mockResolvedValueOnce(authResult());

      await client.completeNewPassword("NewPassword1!");

      expect(call).toHaveBeenCalledWith("RespondToAuthChallenge", {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: CLIENT_ID,
        Session: "session-1",
        ChallengeResponses: {
          USERNAME: "user-sub",
          NEW_PASSWORD: "NewPassword1!",
        },
      });
      expect(storedTokens().refreshToken).toBe("refresh-token");
      expect(session.data.size).toBe(0);
    });

    it("keeps the challenge when the password is rejected", async () => {
      await startChallenge();
      call.mockRejectedValueOnce(cognitoError("InvalidPasswordException"));

      await expect(client.completeNewPassword("weak")).rejects.toMatchObject({
        name: "InvalidPasswordException",
      });
      expect(session.data.size).toBe(1);
    });

    it("works after a reload, since the challenge is in session storage", async () => {
      await startChallenge();
      // A new client over the same storage, as after navigating to /set-password.
      client = createCognitoClient({
        api: { call } as unknown as CognitoApi,
        store: createTokenStore({ persistent, session }),
        clientId: CLIENT_ID,
        now: () => time,
      });
      call.mockResolvedValueOnce(authResult());

      await client.completeNewPassword("NewPassword1!");

      expect(persistent.data.size).toBe(1);
    });

    it("fails when there's no sign-in in progress", async () => {
      await expect(client.completeNewPassword("pw")).rejects.toMatchObject({
        name: "NoChallengeException",
      });
      expect(call).not.toHaveBeenCalled();
    });
  });

  describe("getCurrentUser", () => {
    it("returns null when there are no tokens", async () => {
      expect(await client.getCurrentUser()).toBeNull();
      expect(call).not.toHaveBeenCalled();
    });

    it("returns the user with attributes and groups, username being the sub", async () => {
      await signedIn(
        authResult({
          AccessToken: jwt({
            username: "7a1f-sub",
            sub: "7a1f-sub",
            "cognito:groups": ["Admin"],
          }),
        })
      );
      call.mockResolvedValueOnce({
        UserAttributes: [
          { Name: "sub", Value: "7a1f-sub" },
          { Name: "email", Value: "user@email.com" },
          { Name: "custom:color", Value: "#ff0000" },
        ],
      });

      const user = await client.getCurrentUser();

      expect(call).toHaveBeenCalledWith("GetUser", {
        AccessToken: storedTokens().accessToken,
      });
      expect(user).toEqual({
        username: "7a1f-sub",
        userId: "7a1f-sub",
        attributes: {
          sub: "7a1f-sub",
          email: "user@email.com",
          "custom:color": "#ff0000",
        },
        groups: ["Admin"],
      });
    });

    it("has no groups when the token has none", async () => {
      await signedIn();
      call.mockResolvedValueOnce({ UserAttributes: [] });

      expect((await client.getCurrentUser())?.groups).toEqual([]);
    });
  });

  describe("tokens", () => {
    it("returns the stored access token while it's valid", async () => {
      await signedIn();

      expect(await client.getAccessToken()).toBe(storedTokens().accessToken);
      expect(call).not.toHaveBeenCalled();
    });

    it("returns null when signed out", async () => {
      expect(await client.getAccessToken()).toBeNull();
    });

    it("refreshes the token when less than a minute is left", async () => {
      await signedIn();
      time = NOW + 3600 * 1000 - 59 * 1000;
      call.mockResolvedValueOnce(
        authResult({ AccessToken: "new-access", RefreshToken: undefined })
      );

      expect(await client.getAccessToken()).toBe("new-access");
      expect(call).toHaveBeenCalledWith("InitiateAuth", {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: { REFRESH_TOKEN: "refresh-token" },
      });
      expect(storedTokens()).toMatchObject({
        accessToken: "new-access",
        refreshToken: "refresh-token",
        expiresAt: time + 3600 * 1000,
      });
    });

    it("doesn't refresh when more than a minute is left", async () => {
      await signedIn();
      time = NOW + 3600 * 1000 - 61 * 1000;

      await client.getAccessToken();

      expect(call).not.toHaveBeenCalled();
    });

    it("shares one refresh between concurrent callers", async () => {
      await signedIn();
      time = NOW + 3600 * 1000;
      let resolve: (value: unknown) => void = () => {};
      call.mockReturnValueOnce(new Promise((r) => (resolve = r)));

      const tokens = Promise.all([
        client.getAccessToken(),
        client.getAccessToken(),
        client.getAccessToken(),
      ]);
      resolve(authResult({ AccessToken: "new-access" }));

      expect(await tokens).toEqual(["new-access", "new-access", "new-access"]);
      expect(call).toHaveBeenCalledTimes(1);
    });

    it("refreshes again once the previous refresh is done", async () => {
      await signedIn();
      time = NOW + 3600 * 1000;
      call.mockResolvedValueOnce(
        authResult({ AccessToken: "second", ExpiresIn: 30 })
      );
      await client.getAccessToken();
      time += 31 * 1000;
      call.mockResolvedValueOnce(authResult({ AccessToken: "third" }));

      expect(await client.getAccessToken()).toBe("third");
      expect(call).toHaveBeenCalledTimes(2);
    });

    it("signs the user out when Cognito rejects the refresh token", async () => {
      await signedIn();
      time = NOW + 3600 * 1000;
      call.mockRejectedValueOnce(cognitoError("NotAuthorizedException"));

      await expect(client.getAccessToken()).rejects.toMatchObject({
        name: "NotAuthorizedException",
      });
      expect(persistent.data.size).toBe(0);
      expect(await client.getAccessToken()).toBeNull();
    });

    it("keeps the session when the refresh fails for other reasons", async () => {
      await signedIn();
      time = NOW + 3600 * 1000;
      call.mockRejectedValueOnce(new TypeError("Failed to fetch"));
      await expect(client.getAccessToken()).rejects.toThrow("Failed to fetch");
      call.mockRejectedValueOnce(cognitoError("TooManyRequestsException"));
      await expect(client.getAccessToken()).rejects.toMatchObject({
        name: "TooManyRequestsException",
      });

      expect(persistent.data.size).toBe(1);
    });

    it("treats corrupt stored tokens as signed out", async () => {
      persistent.data.set("wcleaner.auth", "{not json");
      expect(await client.getAccessToken()).toBeNull();
      persistent.data.set("wcleaner.auth", JSON.stringify({ idToken: "x" }));
      expect(await client.getAccessToken()).toBeNull();
    });
  });

  describe("signOut", () => {
    it("revokes the refresh token and clears the store", async () => {
      await signedIn();
      call.mockResolvedValueOnce({});

      await client.signOut();

      expect(call).toHaveBeenCalledWith("RevokeToken", {
        ClientId: CLIENT_ID,
        Token: "refresh-token",
      });
      expect(persistent.data.size).toBe(0);
    });

    it("clears the store even when RevokeToken fails", async () => {
      await signedIn();
      call.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(client.signOut()).resolves.toBeUndefined();
      expect(persistent.data.size).toBe(0);
    });

    it("clears a pending challenge too", async () => {
      session.data.set(
        "wcleaner.auth.challenge",
        JSON.stringify({ session: "s", username: "u" })
      );

      await client.signOut();

      expect(session.data.size).toBe(0);
      expect(call).not.toHaveBeenCalled();
    });
  });

  describe("forgot and reset password", () => {
    it("sends the redirect in the client metadata", async () => {
      call.mockResolvedValueOnce({});

      await client.forgotPassword("user@email.com", "https://app.example.com");

      expect(call).toHaveBeenCalledWith("ForgotPassword", {
        ClientId: CLIENT_ID,
        Username: "user@email.com",
        ClientMetadata: { redirectTo: "https://app.example.com" },
      });
    });

    it("leaves the metadata out when there's no redirect", async () => {
      call.mockResolvedValueOnce({});

      await client.forgotPassword("user@email.com", "");

      expect(call).toHaveBeenCalledWith("ForgotPassword", {
        ClientId: CLIENT_ID,
        Username: "user@email.com",
      });
    });

    it("confirms the new password with the code", async () => {
      call.mockResolvedValueOnce({});

      await client.confirmForgotPassword("user@email.com", "123456", "NewPw1!");

      expect(call).toHaveBeenCalledWith("ConfirmForgotPassword", {
        ClientId: CLIENT_ID,
        Username: "user@email.com",
        ConfirmationCode: "123456",
        Password: "NewPw1!",
      });
    });

    it("passes the errors through", async () => {
      call.mockRejectedValueOnce(cognitoError("UserNotFoundException"));

      await expect(
        client.forgotPassword("nobody@email.com", "")
      ).rejects.toMatchObject({ name: "UserNotFoundException" });
    });
  });

  describe("profile", () => {
    it("updates attributes with the access token", async () => {
      await signedIn();
      call.mockResolvedValueOnce({});

      await client.updateAttributes({ name: "Ann", "custom:color": "#fff" });

      expect(call).toHaveBeenCalledWith("UpdateUserAttributes", {
        AccessToken: storedTokens().accessToken,
        UserAttributes: [
          { Name: "name", Value: "Ann" },
          { Name: "custom:color", Value: "#fff" },
        ],
      });
    });

    it("changes the password with the access token", async () => {
      await signedIn();
      call.mockResolvedValueOnce({});

      await client.changePassword("Old1!", "New1!");

      expect(call).toHaveBeenCalledWith("ChangePassword", {
        AccessToken: storedTokens().accessToken,
        PreviousPassword: "Old1!",
        ProposedPassword: "New1!",
      });
    });

    it("refuses when signed out, without calling Cognito", async () => {
      await expect(
        client.updateAttributes({ name: "Ann" })
      ).rejects.toMatchObject({ name: "NotAuthorizedException" });
      await expect(client.changePassword("a", "b")).rejects.toMatchObject({
        name: "NotAuthorizedException",
      });
      expect(call).not.toHaveBeenCalled();
    });
  });
});
