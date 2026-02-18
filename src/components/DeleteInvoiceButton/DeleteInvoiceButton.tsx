import { FC, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useDeleteInvoice } from "../../hooks/Jobs/useDeleteInvoice";

type DeleteInvoiceButtonProps = {
  customerId: string;
  jobId: string;
  onDeleted: () => void;
};

export const DeleteInvoiceButton: FC<DeleteInvoiceButtonProps> = ({
  customerId,
  jobId,
  onDeleted,
}) => {
  const [open, setOpen] = useState(false);
  const { deleteInvoice, loading, error } = useDeleteInvoice(customerId, jobId);

  const confirm = async () => {
    await deleteInvoice();
    setOpen(false);
    onDeleted();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => setOpen(true)}
      >
        Delete invoice
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete invoice</DialogTitle>
        <DialogContent>
          {error && <ErrorMessage code={error} />}
          This will permanently delete the invoice. You can generate it again
          later.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={confirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
