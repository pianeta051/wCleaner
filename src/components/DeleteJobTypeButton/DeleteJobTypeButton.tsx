import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDeleteJobType } from "../../hooks/Jobs/useDeleteJobType";

type DeleteJobTypeButtonProps = {
  onDelete: () => void;
  jobTypeId: string;
};

export const DeleteJobTypeButton: FC<DeleteJobTypeButtonProps> = ({
  onDelete,
  jobTypeId,
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const { deleteJobType, loading, error } = useDeleteJobType(jobTypeId);
  const deleteHandler = () => {
    deleteJobType(jobTypeId)
      .then(() => {
        setOpenDeleteAlert(false);
        onDelete();
      })
      .catch(() => {
        // Do nothing, the hook manages the error
      });
  };
  const openDialog = () => {
    setOpenDeleteAlert(true);
  };

  const closeDialog = () => {
    setOpenDeleteAlert(false);
  };
  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={openDialog}>
        <DeleteIcon />
      </IconButton>

      <Dialog
        open={openDeleteAlert}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error
              ? "The JobType could not be deleted"
              : "After deleting this item you wont be able to undo this action."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={loading}>
            Cancel
          </Button>
          {!error && (
            <LoadingButton onClick={deleteHandler} autoFocus loading={loading}>
              Agree
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
