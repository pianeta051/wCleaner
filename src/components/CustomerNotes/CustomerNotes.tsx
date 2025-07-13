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
import { useDeleteCustomerNote } from "../../hooks/Customers/customerNotes/useDeleteCustomerNote";
import { useEditNoteFavourite } from "../../hooks/Customers/customerNotes/useEditNoteFavourite";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { useAuth } from "../../context/AuthContext";
import { CognitoUserWithAttributes } from "../../services/authentication";

const isOwner = (
  note: CustomerNote,
  user?: CognitoUserWithAttributes | null
): boolean => {
  if (!note.author || !user) return false;

  const author = note.author.trim().toLowerCase();
  const sub = user.getUsername?.()?.toLowerCase?.();
  const email = user.attributes?.email?.toLowerCase();
  const name = user.attributes?.name?.toLowerCase();

  return author === sub || author === email || author === name;
};

const canEditOrDelete = (
  note: CustomerNote,
  user: CognitoUserWithAttributes | null | undefined,
  isAdmin: boolean
): boolean => isAdmin || isOwner(note, user);

type CustomerNotesProps = {
  customer: Customer;
  jobId?: string;
};

export const CustomerNotes: FC<CustomerNotesProps> = ({ customer, jobId }) => {
  const { isInGroup, user } = useAuth();
  const isAdmin = isInGroup("Admin");
  const { editCustomerNoteFavourite, loading: loadingFav } =
    useEditNoteFavourite(customer.id, customer.slug, jobId);
  const { deleteNote } = useDeleteCustomerNote(
    customer.id,
    customer.slug,
    jobId
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CustomerNote>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const openModal = (note?: CustomerNote) => {
    setEditingNote(note);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(undefined);
  };

  const toggleFavourite = (note: CustomerNote, value: boolean) =>
    editCustomerNoteFavourite({ note, newValue: value });

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setSnackbarMessage("Note deleted");
      setSnackbarSeverity("success");
    } catch {
      setSnackbarMessage("Failed to delete note");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const orderedNotes = useMemo(() => {
    const list = [...(customer.notes ?? [])];
    return list.sort((a, b) => {
      if (a.isFavourite && !b.isFavourite) return -1;
      if (b.isFavourite && !a.isFavourite) return 1;
      return (b.timestamp ?? 0) - (a.timestamp ?? 0);
    });
  }, [customer.notes]);

  const manyNotes = (customer.notes?.length ?? 0) > 3;

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Title>Notes</Title>
        <Button variant="contained" onClick={() => openModal()}>
          Add note
        </Button>
      </Box>

      {customer.notes?.length ? (
        <Box
          sx={{
            maxHeight: manyNotes ? 400 : "auto",
            overflowY: manyNotes ? "auto" : "visible",
            border: "1px solid #ccc",
            borderRadius: 2,
            pr: 1,
          }}
        >
          {orderedNotes.map((note) => {
            const editable = canEditOrDelete(note, user, isAdmin);

            return (
              <Accordion key={note.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <FavouriteButton
                      active={note.isFavourite}
                      disabled={loadingFav}
                      readOnly={!isAdmin}
                      onActivate={() => toggleFavourite(note, true)}
                      onDeactivate={() => toggleFavourite(note, false)}
                    />

                    <Typography fontWeight="bold">
                      {note.title}
                      {note.author ? ` – ${note.author}` : ""}
                      {note.timestamp
                        ? ` – ${new Date(note.timestamp).toLocaleString()}`
                        : ""}
                    </Typography>
                    {note.updatedAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        Last edited {new Date(note.updatedAt).toLocaleString()}
                        {note.updatedBy ? ` by ${note.updatedBy}` : ""}
                      </Typography>
                    )}

                    {editable && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(note);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography>{note.content}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ) : (
        <Alert severity="info">No notes yet.</Alert>
      )}

      <CustomerNoteModal
        open={modalOpen}
        customer={customer}
        onClose={closeModal}
        initialValues={editingNote}
        noteId={editingNote?.id}
        jobId={jobId}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
