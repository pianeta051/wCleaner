import { FC } from "react";
import { Modal, Grid, Paper } from "@mui/material";

import { Customer } from "../../types/types";
import { NoteForm, NoteFormValues } from "../NoteForm/NoteForm";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useAddCustomerNote } from "../../hooks/Customers/customerNotes/useAddCustomerNote";
import {
  ModalBox,
  Background,
  Wrapper,
  Title,
} from "./CustomerNoteModal.style";

type CustomerNoteModalProps = {
  open: boolean;
  customer: Customer;
  initialValues?: NoteFormValues;
  onClose: () => void;
};

export const CustomerNoteModal: FC<CustomerNoteModalProps> = ({
  open,
  customer,
  initialValues,
  onClose,
}) => {
  const { addCustomerNote, loading, error } = useAddCustomerNote(customer.id);

  const isEditing = Boolean(initialValues);

  const handleSubmit = (values: NoteFormValues) => {
    addCustomerNote(values)
      .then(() => {
        onClose();
      })
      .catch(() => {
        // error is handled by the hook
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={isEditing ? "Edit Note" : "New Note"}
      aria-describedby={isEditing ? "Edit Note" : "New Note"}
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">{isEditing ? "Edit Note" : "New Note"}</Title>
          </Grid>
        </Wrapper>

        <Background>
          <NoteForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            defaultValues={initialValues}
            loading={loading}
          />
        </Background>

        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
