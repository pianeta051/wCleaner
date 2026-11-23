import { describe, expect, it, vi } from "vitest";
import { CognitoApiError, createCognitoApi } from "./cognitoApi";

const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue(
    new Response(typeof body === "string" ? body : JSON.stringify(body), {
      status,
    })
  );

describe("createCognitoApi", () => {
  it("posts the action to the regional endpoint", async () => {
    const fetchFn = respond(200, { ok: true });
    const api = createCognitoApi({ region: "eu-west-2", fetchFn });

    const result = await api.call("GetUser", { AccessToken: "token" });

    expect(result).toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledWith(
      "https://cognito-idp.eu-west-2.amazonaws.com/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-amz-json-1.1",
          "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
        },
        body: JSON.stringify({ AccessToken: "token" }),
      }
    );
  });

  it("throws an error named after Cognito's error type", async () => {
    const api = createCognitoApi({
      region: "eu-west-2",
      fetchFn: respond(400, {
        __type: "NotAuthorizedException",
        message: "Password attempts exceeded",
      }),
    });

    const error = await api.call("InitiateAuth", {}).catch((e) => e);

    expect(error).toBeInstanceOf(CognitoApiError);
    expect(error.name).toBe("NotAuthorizedException");
    expect(error.message).toBe("Password attempts exceeded");
    expect(error.status).toBe(400);
  });

  it("strips a namespace from the error type", async () => {
    const api = createCognitoApi({
      region: "eu-west-2",
      fetchFn: respond(400, {
        __type: "com.amazonaws.cognito#CodeMismatchException",
        message: "Invalid code",
      }),
    });

    const error = await api.call("ConfirmForgotPassword", {}).catch((e) => e);

    expect(error.name).toBe("CodeMismatchException");
  });

  it("still throws when the error body is not JSON", async () => {
    const api = createCognitoApi({
      region: "eu-west-2",
      fetchFn: respond(502, "Bad gateway"),
    });

    const error = await api.call("GetUser", {}).catch((e) => e);

    expect(error).toBeInstanceOf(CognitoApiError);
    expect(error.status).toBe(502);
  });

  it("lets network errors through", async () => {
    const api = createCognitoApi({
      region: "eu-west-2",
      fetchFn: vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    });

    await expect(api.call("GetUser", {})).rejects.toThrow("Failed to fetch");
  });
});
