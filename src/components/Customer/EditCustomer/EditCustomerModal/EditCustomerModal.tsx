import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from "@mui/material";
import { FC, useState } from "react";
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
import { ErrorMessage } from "../../../ErrorMessage/ErrorMessage";
import { useCustomers } from "../../../../context/CustomersContext";
import { useEditCustomer } from "../../../../hooks/Customers/useEditCustomer";

type EditCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: () => void;
  customer: Customer;
};

export const EditCustomerModal: FC<EditCustomerModalProps> = ({
  open,
  onClose,
  onDelete,
  onEdit,
  customer,
}) => {
  const { deleteCustomer } = useCustomers();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const {
    editCustomer,
    loading: editing,
    error,
  } = useEditCustomer(customer.id, customer.slug);

  const handleClickOpen = () => {
    setOpenDeleteAlert(true);
  };

  const handleClose = () => {
    setOpenDeleteAlert(false);
  };

  const submitHandler = (formValues: CustomerFormValues) => {
    editCustomer(formValues)
      .then((customer) => {
        onEdit(customer);
      })
      .catch(() => {
        // Do nothing, the hook manages the error
      });
  };

  const deleteHandler = () => {
    if (customer) {
      deleteCustomer(customer.id).then(() => {
        onDelete();
      });
    }
  };

  const closeHandler = () => {
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
            loading={editing}
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
