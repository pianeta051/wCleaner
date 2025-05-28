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
import { useEditCustomerNote } from "../../hooks/Customers/customerNotes/useEditCustomerNote";

type CustomerNoteModalProps = {
  open: boolean;
  customer: Customer;
  initialValues?: NoteFormValues;
  onClose: () => void;
  noteId?: string;
};

export const CustomerNoteModal: FC<CustomerNoteModalProps> = ({
  open,
  customer,
  initialValues,
  onClose,
  noteId,
}) => {
  const {
    addCustomerNote,
    loading: addNoteLoading,
    error: addNoteError,
  } = useAddCustomerNote(customer.id, customer.slug);

  const {
    editCustomerNote,
    loading: editNoteLoading,
    error: editNoteError,
  } = useEditCustomerNote(customer.id, customer.slug, noteId);

  const loading = addNoteLoading || editNoteLoading;
  const error = addNoteError ?? editNoteError ?? null;

  const isEditing = Boolean(initialValues && noteId);

  const handleSubmit = (values: NoteFormValues) => {
    if (!isEditing) {
      addCustomerNote(values)
        .then(() => {
          onClose();
        })
        .catch(() => {
          // error is handled by the hook
        });
    } else {
      editCustomerNote(values)
        .then(() => {
          onClose();
        })
        .catch(() => {
          // error is handled by the hook
        });
    }
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
