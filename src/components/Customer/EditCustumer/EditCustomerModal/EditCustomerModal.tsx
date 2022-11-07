import { Modal } from "@mui/material";
import { FC } from "react";
import { Customer } from "../../../../types/types";
import { EditCustomerForm } from "../EditCustomerForm/EditCustomerForm";
import { ModalBox } from "./EditCustomerModal.style";

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
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Edit Customer"
      aria-describedby="Editing customer"
    >
      <ModalBox>
        <EditCustomerForm
          onEdit={onEdit}
          onCancel={onClose}
          customer={customer}
        />
      </ModalBox>
    </Modal>
  );
};
