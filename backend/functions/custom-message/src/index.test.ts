import { describe, expect, it } from "vitest";
import type { CustomMessageTriggerEvent } from "aws-lambda";
import { handler } from "./index";

// Cognito doesn't send the real code or username to the function: it sends
// these placeholders and substitutes them in the message afterwards. A custom
// message that doesn't contain them is discarded and replaced by Cognito's
// default one, so every message has to keep them untouched.
const event = (triggerSource: string, redirectTo?: string) =>
  ({
    triggerSource,
    userName: "7a1f-sub",
    request: {
      codeParameter: "{####}",
      usernameParameter: "{username}",
      userAttributes: { email: "user+tag@email.com" },
      clientMetadata: redirectTo ? { redirectTo } : undefined,
    },
    response: {},
  } as unknown as CustomMessageTriggerEvent);

const run = async (e: CustomMessageTriggerEvent) =>
  (await handler(e, {} as never, () => {}))!.response;

describe("custom message handler", () => {
  process.env.APP_URL = "https://app.example.com";

  it("keeps the code placeholder in the forgot password link", async () => {
    const { emailSubject, emailMessage } = await run(
      event("CustomMessage_ForgotPassword")
    );

    expect(emailSubject).toBe("Reset your password");
    expect(emailMessage).toContain(
      'href="https://app.example.com/reset-password?email=user%2Btag%40email.com&code={####}"'
    );
  });

  it("keeps the code and username placeholders in the welcome email", async () => {
    const { emailSubject, emailMessage } = await run(
      event("CustomMessage_AdminCreateUser")
    );

    expect(emailSubject).toBe("Welcome to the WCleaner app");
    expect(emailMessage).toContain("{####}");
    expect(emailMessage).toContain("{username}");
    expect(emailMessage).toContain('href="https://app.example.com/log-in"');
  });

  it("leaves other trigger sources for Cognito's default message", async () => {
    const response = await run(event("CustomMessage_ResendCode"));

    expect(response.emailMessage).toBeUndefined();
    expect(response.emailSubject).toBeUndefined();
  });
});
