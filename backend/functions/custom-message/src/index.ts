import type { CustomMessageTriggerHandler } from "aws-lambda";
import { createUserTemplate, forgotPasswordTemplate } from "./templates";

// Cognito CustomMessage trigger. Only AdminCreateUser and ForgotPassword get a custom
// message; every other trigger source is returned untouched so Cognito sends its default.
export const handler: CustomMessageTriggerHandler = async (event) => {
  const redirectTo =
    event.request.clientMetadata?.redirectTo ?? process.env.APP_URL ?? "";

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
