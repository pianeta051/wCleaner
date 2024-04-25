import { Modal } from "@mui/material";
import { FC } from "react";
import { Customer } from "../../../../types/types";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "../../CustomerForm/CustomerForm.style";
import { Grid } from "@mui/material";
import { ErrorMessage } from "../../../ErrorMessage/ErrorMessage";
import { useAddCustomer } from "../../../../hooks/Customers/useAddCustomer";

type NewCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
};
export const NewCustomerModal: FC<NewCustomerModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { addCustomer, error, loading } = useAddCustomer();

  const submitHandler = (formValues: CustomerFormValues) => {
    addCustomer(formValues)
      .then((customer) => {
        onSubmit(customer);
      })
      .catch(() => {
        // Do nothing, the hook manages the error
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
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
