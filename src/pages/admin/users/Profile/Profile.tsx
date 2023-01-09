import { Box, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ProfileName } from "../../../../components/ProfileName/ProfileName";
import {
  currentUser,
  updateName,
  updatePassword,
  User,
} from "../../../../services/authentication";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import {
  ProfilePassword,
  ProfilePasswordFormValues,
} from "../../../../components/ProfilePassword/ProfilePassword";
import { Line } from "./Profile.style";

export const ProfilePage: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingName, setChangingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  useEffect(() => {
    if (loading) {
      currentUser()
        .then((user) => {
          setUser(user);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (isErrorCode(error)) {
            setError(error);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  });

  const changeNameHandler = (newName: string) => {
    if (user) {
      setChangingName(true);
      updateName(user?.email, newName)
        .then((newUser) => {
          setChangingName(false);
          setUser(newUser);
        })
        .catch((error) => {
          setChangingName(false);
          if (isErrorCode(error)) {
            setError(error);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  const changePasswordHandler = ({
    oldPassword,
    newPassword,
  }: ProfilePasswordFormValues) => {
    if (user) {
      setChangingPassword(true);
      updatePassword(user.email, oldPassword, newPassword)
        .then(() => {
          setChangingPassword(false);
        })
        .catch((error) => {
          setChangingName(false);
          if (isErrorCode(error)) {
            setError(error);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        My Profile
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <ErrorMessage code={error} />
      ) : user ? (
        <Box>
          <ProfileName
            name={user?.name}
            onChange={changeNameHandler}
            loading={changingName}
          />
          <Line flexItem />
          <ProfilePassword
            onChange={changePasswordHandler}
            loading={changingPassword}
          />
        </Box>
      ) : (
        <ErrorMessage code="USER_NOT_EXISTS" />
      )}
    </>
  );
};
