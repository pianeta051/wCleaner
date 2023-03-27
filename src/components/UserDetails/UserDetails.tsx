import { Typography } from "@mui/material";
import { FC } from "react";
import { User } from "../../services/authentication";
import { UserGroups } from "../UserGroups/UserGroups";
import { Wrapper } from "./UserDetails.style";

type UserDetailsProps = {
  user: User;
};
export const UserDetails: FC<UserDetailsProps> = ({ user }) => {
  return (
    <>
      <Typography align="center" variant="h3" gutterBottom>
        User Details
      </Typography>
      <Wrapper>
        <h3>Name:</h3>
        <p>{user.name}</p>
        <h3>Email:</h3>
        <p>{user.email}</p>
        <UserGroups id={user.id} />
      </Wrapper>
    </>
  );
};
