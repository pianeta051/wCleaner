import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { removeUser } from "../../services/authentication";

type DeleteUserProps = {
  id: string;
  openDialog: boolean;
  onClose: () => void;
};

export const DeleteUser: FC<DeleteUserProps> = ({
  id,
  openDialog,
  onClose,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const agreeHandler = () => {
    removeUser(id)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };
  return (
    <>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Disagree</Button>
          <Button onClick={agreeHandler}>Agree</Button>
        </DialogActions>
      </Dialog>
      {error && <ErrorMessage code={error} />}
    </>
  );
};
