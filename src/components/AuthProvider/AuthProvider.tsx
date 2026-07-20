import { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getAuthenticatedUser,
  CognitoUserWithAttributes,
  logOut as serviceLogOut,
} from "../../services/authentication";
import { CircularProgress } from "@mui/material";

type AuthProviderProps = {
  children?: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CognitoUserWithAttributes | null>(null);
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

  const logIn = (user: CognitoUserWithAttributes) => {
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
  const isInGroup = (group: string): boolean => {
    if (!user) {
      return false;
    }
    return user?.groups?.includes(group) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, authStatus, logOut, logIn, isInGroup }}
    >
      {authStatus === "checking" ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
};
