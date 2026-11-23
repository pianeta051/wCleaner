import {
  getCurrentUser,
  resetPassword,
  signIn,
  fetchUserAttributes,
  fetchAuthSession,
  confirmSignIn,
  signOut,
  confirmResetPassword,
  updatePassword,
  updateUserAttributes,
} from "aws-amplify/auth";
import { AuthClient, CognitoUserWithAttributes } from "./types";

export const amplifyClient: AuthClient = {
  async signIn(email, password) {
    const response = await signIn({ username: email, password });
    return response.nextStep?.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ? "NEW_PASSWORD_REQUIRED"
      : "DONE";
  },

  async completeNewPassword(newPassword) {
    await confirmSignIn({ challengeResponse: newPassword });
  },

  async signOut() {
    await signOut();
  },

  async getCurrentUser() {
    const user: CognitoUserWithAttributes = await getCurrentUser();
    if (!user) {
      return null;
    }
    const attributes = await fetchUserAttributes();
    user.attributes = attributes as Record<string, string>;
    const authSession = await fetchAuthSession();
    const groups = authSession.tokens?.accessToken?.payload?.[
      "cognito:groups"
    ] as string[];
    user.groups = groups ?? [];
    return user;
  },

  async getAccessToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.accessToken?.toString() ?? null;
  },

  async forgotPassword(email, redirectTo) {
    await resetPassword({
      username: email,
      options: {
        redirectTo,
      },
    });
  },

  async confirmForgotPassword(email, code, newPassword) {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  },

  async updateAttributes(attributes) {
    await updateUserAttributes({ userAttributes: attributes });
  },

  async changePassword(oldPassword, newPassword) {
    await updatePassword({ oldPassword, newPassword });
  },
};
