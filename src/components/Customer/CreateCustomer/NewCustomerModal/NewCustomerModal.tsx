import { Modal } from "@mui/material";
import { FC, useState } from "react";
import { Customer } from "../../../../types/types";
import { ModalBox } from "./NewCustomerModal.style";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../CustomerForm/CustomerForm";
import { addCustomer } from "../../../../services/customers";

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
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = (formValues: CustomerFormValues) => {
    setErrorMessage("");
    setLoading(true);
    addCustomer(formValues)
      .then((customer) => {
        setLoading(false);
        onSubmit(customer);
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
      aria-labelledby="New Customer"
      aria-describedby="Create a new customer"
    >
      <ModalBox>
        <CustomerForm
          onSubmit={submitHandler}
          onCancel={onClose}
          loading={loading}
          errorMessage={errorMessage}
        />
      </ModalBox>
    </Modal>
  );
};
