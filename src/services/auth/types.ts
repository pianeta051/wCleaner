export type CognitoUserWithAttributes = {
  username: string;
  userId: string;
  attributes?: {
    [key: string]: string;
  };
  groups?: string[];
};

export type SignInResult = "DONE" | "NEW_PASSWORD_REQUIRED";

export type AuthClient = {
  signIn(email: string, password: string): Promise<SignInResult>;
  completeNewPassword(newPassword: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<CognitoUserWithAttributes | null>;
  getAccessToken(): Promise<string | null>;
  forgotPassword(email: string, redirectTo: string): Promise<void>;
  confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<void>;
  updateAttributes(attributes: Record<string, string>): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
};
