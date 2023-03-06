import { Avatar } from "@mui/material";
import { FC } from "react";
import { useAuth } from "../../context/AuthContext";

export const ProfileIcon: FC = () => {
  const { user } = useAuth();

  const getInitials = (): string | null => {
    if (!user?.attributes) {
      return null;
    }
    if (!user?.attributes?.name) {
      return user?.attributes.email[0];
    }
    return user?.attributes.name[0];
  };

  const initials = getInitials();
  return <Avatar>{initials && initials?.toUpperCase()}</Avatar>;
};
