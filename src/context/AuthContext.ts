import { CognitoUser } from "amazon-cognito-identity-js";
import { createContext, useContext } from "react";

type AuthContextData = {
  user: CognitoUser | null;
  setUser?: (user: CognitoUser) => void;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  logIn?: (user: CognitoUser) => void;
  logOut?: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  authStatus: "checking",
});

export const useAuth = () => useContext(AuthContext);
