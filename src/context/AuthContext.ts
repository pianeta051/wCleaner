import { createContext, useContext } from "react";
import { CognitoUserWithAttributes } from "../services/authentication";

export type AuthContextData = {
  user: CognitoUserWithAttributes | null;
  setUser?: (user: CognitoUserWithAttributes) => void;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  logIn?: (user: CognitoUserWithAttributes) => void;
  logOut?: () => Promise<void>;
  isInGroup: (group: string) => boolean;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  authStatus: "checking",
  logOut: async () => {
    console.log("Log out");
  },
  logIn: () => console.log("Log in"),
  isInGroup: () => false,
});

export const useAuth = () => useContext(AuthContext);
