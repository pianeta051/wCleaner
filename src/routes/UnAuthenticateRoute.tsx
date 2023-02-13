import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UnAuthenticatedRouteProps = {
  children: ReactElement;
};

export const UnAuthenticatedRoute: FC<UnAuthenticatedRouteProps> = ({
  children,
}) => {
  const { authStatus } = useAuth();
  return authStatus === "unauthenticated" ? children : <Navigate to="/users" />;
};
