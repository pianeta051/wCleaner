import type { CustomMessageTriggerHandler } from "aws-lambda";
import { resolveRedirectTo } from "./redirect";
import { createUserTemplate, forgotPasswordTemplate } from "./templates";

// Cognito CustomMessage trigger. Only AdminCreateUser and ForgotPassword get a custom
// message; every other trigger source is returned untouched so Cognito sends its default.
export const handler: CustomMessageTriggerHandler = async (event) => {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    throw new Error("APP_URL is not set");
  }
  const allowedOrigins = (process.env.ALLOWED_REDIRECT_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const redirectTo = resolveRedirectTo(
    event.request.clientMetadata?.redirectTo,
    appUrl,
    allowedOrigins
  );

  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    event.response.emailSubject = "Welcome to the WCleaner app";
    event.response.emailMessage = createUserTemplate(
      event.request.usernameParameter ?? event.userName,
      event.request.codeParameter,
      redirectTo
    );
  }

  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    event.response.emailSubject = "Reset your password";
    event.response.emailMessage = forgotPasswordTemplate(
      event.request.userAttributes.email,
      event.request.codeParameter,
      redirectTo
    );
  }

  return event;
};
