import { Alert, Box, Typography } from "@mui/material";
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
import { Line } from "./Profile.style";
import { useAuth } from "../../../../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";

export const ProfilePage: FC = () => {
  const { user, setUser } = useAuth();
  const [changingName, setChangingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const changeNameHandler = (newName: string) => {
    if (user) {
      setChangingName(true);
      updateName(user, newName)
        .then((user) => {
          setChangingName(false);
          if (setUser) {
            setUser(user);
          }
          setSnackbarOpen(true);
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
      updatePassword(user, oldPassword, newPassword)
        .then(() => {
          setChangingPassword(false);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setChangingPassword(false);
          if (isErrorCode(error)) {
            setError(error);
          } else {
            setError("INTERNAL_ERROR");
          }
        });
    }
  };

  const closeHandler = () => {
    setSnackbarOpen(false);
  };

  const name: string = user?.attributes?.name || "";
  return (
    <>
      <Typography variant="h3" gutterBottom>
        My Profile
      </Typography>
      {error && <ErrorMessage code={error} />}
      <Box>
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
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeHandler}
      >
        <Alert onClose={closeHandler} severity="success" sx={{ width: "100%" }}>
          Successfully updated
        </Alert>
      </Snackbar>
    </>
  );
};
