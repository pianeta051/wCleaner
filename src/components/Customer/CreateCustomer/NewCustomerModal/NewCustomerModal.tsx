import { Modal, Grid, Alert } from "@mui/material";
import { FC } from "react";
import { Customer } from "../../../../types/types";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import {
  Background,
  Wrapper,
  Title,
} from "../../CustomerForm/CustomerForm.style";
import { ModalBox } from "./NewCustomerModal.style";

type NewCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
  addCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  loading: boolean;
  error?: string;
};

export const NewCustomerModal: FC<NewCustomerModalProps> = ({
  open,
  onClose,
  onSubmit,
  addCustomer,
  loading,
  error,
}) => {
  const submitHandler = (formValues: CustomerFormValues) => {
    addCustomer(formValues)
      .then((customer) => {
        onSubmit(customer);
      })
      .catch(() => {
        // Error shown below
      });
  };

  const closeHandler = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby="New Customer"
      aria-describedby="Create a new customer"
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">New Customer</Title>
          </Grid>
        </Wrapper>

        <Background>
          <CustomerForm
            onSubmit={submitHandler}
            onCancel={onClose}
            loading={loading}
          />
        </Background>

        {error && (
          <Grid item xs={12} mt={2}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </ModalBox>
    </Modal>
  );
};
