import { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CognitoUser } from "amazon-cognito-identity-js";
import {
  getAuthenticatedUser,
  logOut as serviceLogOut,
} from "../../services/authentication";
import { CircularProgress } from "@mui/material";

type AuthProviderProps = {
  children?: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [authStatus, setAuthStatus] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  useEffect(() => {
    getAuthenticatedUser().then((user) => {
      setUser(user);
      if (user) {
        setAuthStatus("authenticated");
      } else {
        setAuthStatus("unauthenticated");
      }
    });
  }, []);

  const logIn = (user: CognitoUser) => {
    setUser(user);
    setAuthStatus("authenticated");
  };

  const logOut = async () => {
    try {
      await serviceLogOut();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setAuthStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authStatus, logIn, logOut }}>
      {authStatus === "checking" ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
};
