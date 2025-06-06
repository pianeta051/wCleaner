import { FC, useMemo, useState } from "react";
import {
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  IconButton,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Customer, CustomerNote } from "../../types/types";
import { Title } from "./CustomerNotes.style";
import { CustomerNoteModal } from "../CustomerNoteModal/CustomerNoteModal";
import { FavouriteButton } from "../FavouriteButton/FavouriteButton";

type CustomerNotesProps = {
  customer: Customer;
};

export const CustomerNotes: FC<CustomerNotesProps> = ({ customer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CustomerNote | undefined>();

  const openModalHandler = () => {
    setEditingNote(undefined);
    setModalOpen(true);
  };

  const closeModalHandler = () => {
    setModalOpen(false);
    setEditingNote(undefined);
  };

  const handleEditNote = (note: CustomerNote) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    console.log("TODO: delete note with ID:", noteId);
  };

  const hasManyNotes = (customer.notes?.length ?? 0) > 3;

  const orderedNotes = useMemo(() => {
    const notesCopy = [...(customer?.notes ?? [])];
    return notesCopy.sort((a, b) => {
      if (a.isFavourite && !b.isFavourite) {
        return -1;
      }
      if (b.isFavourite && !a.isFavourite) {
        return 1;
      }
      if (!a.timestamp || !b.timestamp) {
        return 0;
      }
      return b.timestamp - a.timestamp;
    });
  }, [customer.notes]);

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Title>Notes</Title>
        <Button variant="outlined" onClick={openModalHandler}>
          Add note
        </Button>
      </Box>

      {customer.notes?.length ? (
        <Box
          sx={{
            maxHeight: hasManyNotes ? 400 : "auto",
            overflowY: hasManyNotes ? "auto" : "visible",
            border: "1px solid #ccc",
            borderRadius: 2,
            pr: 1,
          }}
        >
          {orderedNotes.map((note, index) => (
            <Accordion key={note.id || index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <FavouriteButton initialState={note.isFavourite} />
                  <Typography fontWeight="bold">
                    {note.title}
                    {note.author ? ` - ${note.author}` : ""}
                    {note.timestamp
                      ? ` - ${new Date(note.timestamp).toLocaleString()}`
                      : ""}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{note.content}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Alert severity="info">No notes yet.</Alert>
      )}

      <CustomerNoteModal
        open={modalOpen}
        customer={customer}
        onClose={closeModalHandler}
        initialValues={editingNote}
      />
    </>
  );
};
