import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AuthenticatedRouteProps = {
  children: ReactElement;
};

export const AuthenticatedRoute: FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { authStatus } = useAuth();
  return authStatus === "authenticated" ? children : <Navigate to="/log-in" />;
};
