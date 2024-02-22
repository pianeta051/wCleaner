import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useState } from "react";

import { ButtonWrapper } from "../DeleteCustomerButton/DeleteCustomerButton.style";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useDeleteCustomer } from "../../hooks/useDeleteCustomer";
import { LoadingButton } from "@mui/lab";

type DeleteCustomerButtonProps = {
  customerId: string;
};

export const DeleteCustomerButton: FC<DeleteCustomerButtonProps> = ({
  customerId,
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const { deleteCustomer, loading, error } = useDeleteCustomer(customerId);

  const deleteHandler = () => {
    deleteCustomer().then(() => {
      setOpenDeleteAlert(false);
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
              ? "The customer could not be deleted"
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
