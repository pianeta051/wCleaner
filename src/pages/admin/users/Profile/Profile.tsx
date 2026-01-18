import { Alert, Button, Snackbar } from "@mui/material";
import { FC, useState } from "react";

import { ProfileName } from "../../../../components/ProfileName/ProfileName";
import {
  updateName,
  updatePassword,
} from "../../../../services/authentication";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import {
  ProfilePassword,
  ProfilePasswordFormValues,
} from "../../../../components/ProfilePassword/ProfilePassword";
import { useAuth } from "../../../../context/AuthContext";

import {
  Line,
  PageTitle,
  ProfileCard,
  ProfileContainer,
  PageWrap,
} from "./Profile.style";

export const ProfilePage: FC = () => {
  const { user, setUser } = useAuth();
  const [changingName, setChangingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const changeNameHandler = (newName: string) => {
    if (!user) return;
    setError(null);
    setChangingName(true);

    updateName(user, newName)
      .then((updatedUser) => {
        setChangingName(false);
        setUser?.(updatedUser);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setChangingName(false);
        setError(isErrorCode(err) ? err : "INTERNAL_ERROR");
      });
  };

  const changePasswordHandler = ({
    oldPassword,
    newPassword,
  }: ProfilePasswordFormValues) => {
    if (!user) return;
    setError(null);
    setChangingPassword(true);

    updatePassword(user, oldPassword, newPassword)
      .then(() => {
        setChangingPassword(false);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setChangingPassword(false);
        setError(isErrorCode(err) ? err : "INTERNAL_ERROR");
      });
  };

  const closeHandler = () => setSnackbarOpen(false);
  const name: string = user?.attributes?.name || "";

  return (
    <PageWrap>
      <ProfileContainer>
        <PageTitle>My Profile</PageTitle>

        {error && <ErrorMessage code={error} />}

        <ProfileCard elevation={0}>
          <ProfileName
            name={name}
            onChange={changeNameHandler}
            loading={changingName}
          />

          <Line flexItem />

          <ProfilePassword
            onChange={changePasswordHandler}
            loading={changingPassword}
          />
        </ProfileCard>
      </ProfileContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeHandler}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeHandler} severity="success" sx={{ width: "100%" }}>
          Successfully updated
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};
