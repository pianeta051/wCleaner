import { Modal } from "@mui/material";
import { FC } from "react";
import { Customer } from "../../../types/types";
import { NewCustomerForm } from "../NewCustomerForm/NewCustomerForm";
import { ModalBox } from "./NewCustomerModal.style";

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
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="New Customer"
      aria-describedby="Create a new customer"
    >
      <ModalBox>
        <NewCustomerForm onSubmit={onSubmit} onCancel={onClose} />
      </ModalBox>
    </Modal>
  );
};
