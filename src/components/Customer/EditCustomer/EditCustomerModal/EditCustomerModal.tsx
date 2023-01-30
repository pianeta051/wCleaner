import { Modal } from "@mui/material";
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
import { editCustomer } from "../../../../services/customers";
import { ErrorCode, isErrorCode } from "../../../../services/error";

type EditCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  customer: Customer;
};
export const EditCustomerModal: FC<EditCustomerModalProps> = ({
  open,
  onClose,
  onEdit,
  customer,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const submitHandler = (formValues: CustomerFormValues) => {
    setError(null);
    setLoading(true);
    editCustomer(formValues, customer.id)
      .then((customer) => {
        setLoading(false);
        onEdit(customer);
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
          <CustomerForm
            onCancel={onClose}
            onSubmit={submitHandler}
            initialValues={customer}
            errorMessage={error}
            loading={loading}
          />
        </Background>
      </ModalBox>
    </Modal>
  );
};
