import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress } from "@mui/material";
import { FC, SetStateAction, useEffect, useState } from "react";
import {
  getUserGroups,
  makeUserAdmin,
  removeUserAdmin,
} from "../../services/authentication";
import { ErrorCode, isErrorCode } from "../../services/error";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useAuth } from "../../context/AuthContext";

type UserGroupsProps = {
  id: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const UserGroups: FC<UserGroupsProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [makingAdmin, setMakingAdmin] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [openAlert, setOpenAlert] = useState(false);

  const { user } = useAuth();

  const agreeHandler = () => {
    setOpenAlert(false);
    setMakingAdmin(true);

    removeUserAdmin(id)
      .then(() => {
        setGroups([]);
        setMakingAdmin(false);
      })
      .catch((error) => {
        setMakingAdmin(false);
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const closeHandler = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    if (loading) {
      getUserGroups(id)
        .then((groups: SetStateAction<string[]>) => {
          setLoading(false);
          setGroups(groups);
        })
        .catch(() => {
          setError("INTERNAL_ERROR");
          setLoading(false);
        });
    }
  }, [loading, setGroups, setLoading, id]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
  }, [id]);

  const makeAdminHandler = () => {
    setMakingAdmin(true);
    setError(null);
    makeUserAdmin(id)
      .then(() => {
        setGroups(["Admin"]);
        setMakingAdmin(false);
      })
      .catch((error) => {
        setMakingAdmin(false);
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const removeButtonClickHandler = () => {
    setError(null);
    setOpenAlert(true);
  };

  const roleButton = () => {
    if (groups.includes("Admin")) {
      if (user?.getUsername() === id) {
        return null;
      }
      return (
        <LoadingButton
          loading={makingAdmin}
          variant="outlined"
          color="error"
          onClick={removeButtonClickHandler}
        >
          Remove Admin access
        </LoadingButton>
      );
    } else {
      return (
        <LoadingButton
          loading={makingAdmin}
          variant="outlined"
          onClick={makeAdminHandler}
        >
          Make Admin
        </LoadingButton>
      );
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <h3>Groups</h3>
      {groups.map((group) => (
        <p key={group}>{group}</p>
      ))}
      {roleButton()}
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeHandler}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action will remove this user from the Admin group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Disagree</Button>
          <Button onClick={agreeHandler}>Agree</Button>
        </DialogActions>
      </Dialog>
      {error && <ErrorMessage code={error} />}
    </>
  );
};
