import { FC, useMemo, useState } from "react";
import {
  Button,
  Box,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

import { Customer, CustomerNote } from "../../types/types";
import { CustomerNoteModal } from "../CustomerNoteModal/CustomerNoteModal";
import { FavouriteButton } from "../FavouriteButton/FavouriteButton";
import { useDeleteCustomerNote } from "../../hooks/Customers/customerNotes/useDeleteCustomerNote";
import { useEditNoteFavourite } from "../../hooks/Customers/customerNotes/useEditNoteFavourite";
import { useAuth } from "../../context/AuthContext";
import { CognitoUserWithAttributes } from "../../services/authentication";

import {
  NotesSection,
  SectionHeader,
  SectionTitle,
  NotesContainer,
  NoteAccordion,
} from "./CustomerNotes.style";

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
      <NotesSection>
        <SectionHeader>
          <SectionTitle variant="h6">Notes</SectionTitle>

          <Button variant="outlined" onClick={() => openModal()}>
            Add note
          </Button>
        </SectionHeader>

        {customer.notes?.length ? (
          <NotesContainer scrollable={manyNotes}>
            {orderedNotes.map((note) => {
              const editable = canEditOrDelete(note, user, isAdmin);

              return (
                <NoteAccordion key={note.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateRows: "auto auto auto",
                        rowGap: 0.5,
                      }}
                    >
                      {/* LINEA 1: Favourite + Title */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <FavouriteButton
                          active={note.isFavourite}
                          disabled={loadingFav}
                          readOnly={!isAdmin}
                          onActivate={() => toggleFavourite(note, true)}
                          onDeactivate={() => toggleFavourite(note, false)}
                        />

                        <Typography fontWeight={700}>
                          {note.title}
                          {note.author ? ` – ${note.author}` : ""}
                        </Typography>
                      </Box>

                      {/* LINEA 2: Timestamp */}
                      <Typography variant="caption" color="text.secondary">
                        {note.timestamp
                          ? new Date(note.timestamp).toLocaleString()
                          : ""}
                        {note.updatedAt && (
                          <>
                            {" • edited "}
                            {new Date(note.updatedAt).toLocaleString()}
                            {note.updatedBy ? ` by ${note.updatedBy}` : ""}
                          </>
                        )}
                      </Typography>

                      {/* LINEA 3: Actions */}
                      {editable && (
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          gap={0.5}
                        >
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
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography>{note.content}</Typography>
                  </AccordionDetails>
                </NoteAccordion>
              );
            })}
          </NotesContainer>
        ) : (
          <Alert severity="info">No notes yet.</Alert>
        )}
      </NotesSection>

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
