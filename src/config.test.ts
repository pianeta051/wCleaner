import { describe, expect, it } from "vitest";
import { readConfig } from "./config";

describe("readConfig", () => {
  it.each([undefined, "", "false", "TRUE", "1", "yes"])(
    "stays in Amplify mode when the switch is %j",
    (value) => {
      const config = readConfig({
        VITE_SWITCH_TO_NEW_INFRA: value,
        VITE_COGNITO_USER_POOL_ID: "eu-west-2_AbC123",
        VITE_COGNITO_CLIENT_ID: "client",
      });
      expect(config).toEqual({ switchToNewInfra: false });
    }
  );

  it("reads the Cognito config, taking the region from the pool id", () => {
    expect(
      readConfig({
        VITE_SWITCH_TO_NEW_INFRA: "true",
        VITE_COGNITO_USER_POOL_ID: "eu-west-2_AbC123",
        VITE_COGNITO_CLIENT_ID: "client",
      })
    ).toEqual({
      switchToNewInfra: true,
      cognito: {
        userPoolId: "eu-west-2_AbC123",
        clientId: "client",
        region: "eu-west-2",
      },
    });
  });

  it("throws when the pool id is missing", () => {
    expect(() =>
      readConfig({
        VITE_SWITCH_TO_NEW_INFRA: "true",
        VITE_COGNITO_CLIENT_ID: "client",
      })
    ).toThrow("VITE_COGNITO_USER_POOL_ID is not set");
  });

  it("throws when the client id is missing", () => {
    expect(() =>
      readConfig({
        VITE_SWITCH_TO_NEW_INFRA: "true",
        VITE_COGNITO_USER_POOL_ID: "eu-west-2_AbC123",
      })
    ).toThrow("VITE_COGNITO_CLIENT_ID is not set");
  });

  it("names both when both are missing", () => {
    expect(() => readConfig({ VITE_SWITCH_TO_NEW_INFRA: "true" })).toThrow(
      "VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID are not set"
    );
  });

  it("throws when the pool id has no region", () => {
    expect(() =>
      readConfig({
        VITE_SWITCH_TO_NEW_INFRA: "true",
        VITE_COGNITO_USER_POOL_ID: "AbC123",
        VITE_COGNITO_CLIENT_ID: "client",
      })
    ).toThrow("not valid");
  });
});
