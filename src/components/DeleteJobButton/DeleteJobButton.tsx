import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useState } from "react";

import { ButtonWrapper } from "../DeleteJobButton/DeleteJobButton.style";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useDeleteJob } from "../../hooks/Jobs/useDeleteJob";

type DeleteJobButtonProps = {
  jobId: string;
  customerId: string;
};

export const DeleteJobButton: FC<DeleteJobButtonProps> = ({
  jobId,
  customerId,
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const { deleteCustomerJob, loading, error } = useDeleteJob(customerId);
  const deleteHandler = () => {
    deleteCustomerJob(jobId)
      .then(() => {
        setOpenDeleteAlert(false);
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
      <ButtonWrapper>
        <DeleteOutlinedIcon onClick={openDialog}></DeleteOutlinedIcon>
      </ButtonWrapper>
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
              ? "The Job could not be deleted"
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
