import { FC, ReactElement } from "react";
import { ErrorMessage } from "../components/ErrorMessage/ErrorMessage";
import { useAuth } from "../context/AuthContext";

type AdminRouteProps = {
  children: ReactElement;
};

export const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { isInGroup } = useAuth();
  return isInGroup("Admin") ? children : <ErrorMessage code="UNAUTHORIZED" />;
};
