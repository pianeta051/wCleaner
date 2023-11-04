import { Modal } from "@mui/material";
import { FC, useState } from "react";
import { Customer } from "../../../../types/types";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "../../CustomerForm/CustomerForm.style";
import { Grid } from "@mui/material";
import { ErrorMessage } from "../../../ErrorMessage/ErrorMessage";
import { useCustomers } from "../../../../context/CustomersContext";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { addCustomer } = useCustomers();

  const submitHandler = (formValues: CustomerFormValues) => {
    setLoading(true);
    setError(null);
    addCustomer(formValues)
      .then((customer) => {
        setLoading(false);
        onSubmit(customer);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
