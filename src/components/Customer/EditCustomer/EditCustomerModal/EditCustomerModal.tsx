import { Modal } from "@mui/material";
import { FC, useState } from "react";
import { Customer } from "../../../../types/types";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "./EditCustomerModal.style";
import { Grid } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import { editCustomer } from "../../../../services/customers";

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
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = (formValues: CustomerFormValues) => {
    setErrorMessage("");
    setLoading(true);
    editCustomer(formValues, customer.id)
      .then((customer) => {
        setLoading(false);
        onEdit(customer);
      })
      .catch((error) => {
        setLoading(false);
        if (typeof error === "string") {
          setErrorMessage(error);
        } else {
          setErrorMessage("Internal error");
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
        <Background>
          <Wrapper container>
            <Grid item xs={12}>
              <Title variant="h4">Edit Customer</Title>
            </Grid>
          </Wrapper>
          <CustomerForm
            onCancel={onClose}
            onSubmit={submitHandler}
            initialValues={customer}
            errorMessage={errorMessage}
            loading={loading}
          />
        </Background>
      </ModalBox>
    </Modal>
  );
};
