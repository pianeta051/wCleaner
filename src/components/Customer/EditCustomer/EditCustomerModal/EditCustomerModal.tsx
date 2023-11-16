import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Customer } from "../../../../types/types";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "../../CustomerForm/CustomerForm.style";
import { Grid } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { ErrorMessage } from "../../../ErrorMessage/ErrorMessage";
import { useParams } from "react-router-dom";
import { useCustomers } from "../../../../context/CustomersContext";

type EditCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: () => void;
  customer: Customer;
};
type EditCustomerParams = {
  id: string;
};

export const EditCustomerModal: FC<EditCustomerModalProps> = ({
  open,
  onClose,
  customer,
  onDelete,
  onEdit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id } = useParams<EditCustomerParams>();
  const { getCustomer, editCustomer, deleteCustomer } = useCustomers();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleClickOpen = () => {
    setOpenDeleteAlert(true);
  };

  const handleClose = () => {
    setOpenDeleteAlert(false);
  };
  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, []);

  const submitHandler = (formValues: CustomerFormValues) => {
    setError(null);
    setLoading(true);
    editCustomer(customer.id, formValues)
      .then((customer) => {
        onEdit(customer);
      })
      .catch((error) => {
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const deleteHandler = () => {
    setLoading(true);
    deleteCustomer(customer.id)
      .then(() => {
        setLoading(false);
        onDelete();
      })
      .catch((error) => {
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  const closeHandler = () => {
    setLoading(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby="Edit Customer"
      aria-describedby="Editing customer"
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">Edit Customer</Title>
          </Grid>
        </Wrapper>
        <Background>
          {error && <ErrorMessage code={error} />}
          <CustomerForm
            onCancel={onClose}
            onSubmit={submitHandler}
            initialValues={customer}
            loading={loading}
            onDelete={handleClickOpen}
          />
        </Background>
        <Dialog
          open={openDeleteAlert}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              After deleting this item you wont be able to undo this action.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={deleteHandler} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </ModalBox>
    </Modal>
  );
};
