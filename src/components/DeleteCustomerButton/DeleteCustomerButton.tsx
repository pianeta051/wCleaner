import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

import { ButtonWrapper } from "../DeleteCustomerButton/DeleteCustomerButton.style";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useDeleteCustomer } from "../../hooks/Customers/useDeleteCustomer";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";

type DeleteCustomerButtonProps = {
  customerId: string;
  onDelete?: () => void;
};

export const DeleteCustomerButton: FC<DeleteCustomerButtonProps> = ({
  customerId,
  onDelete,
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const { deleteCustomer, loading, error } = useDeleteCustomer(customerId);
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  const deleteHandler = () => {
    deleteCustomer()
      .then(() => {
        setOpenDeleteAlert(false);
        onDelete?.();
        navigate("/admin/customers");
      })
      .catch(() => {
        // Do nothing, the hook manages the error
      });
  };

  const openDialog = () => {
    setErrorMessage(null);
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
            {errorMessage
              ? "The customer could not be deleted"
              : "After deleting this item you wont be able to undo this action."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={loading}>
            Cancel
          </Button>
          {!errorMessage && (
            <LoadingButton onClick={deleteHandler} autoFocus loading={loading}>
              Agree
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
