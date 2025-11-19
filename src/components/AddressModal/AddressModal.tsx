import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useUpdateJobAddress } from "../../hooks/Jobs/useUpdateJobAddress";
import { useDeleteCustomerAddress } from "../../hooks/Customers/addresses/useDeleteCustomerAddress";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import { AddressSelector } from "../AddressSelector/AddressSelector";

type AddressModalProps = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  onUpdated: () => void;
  oldAddressId: string;
};

export const AddressModal: FC<AddressModalProps> = ({
  open,
  onClose,
  customerId,
  onUpdated,
  oldAddressId,
}) => {
  const [selected, setSelected] = useState<string>("");

  const {
    updateJobAddress,
    loading: saving,
    error: errorUpdate,
  } = useUpdateJobAddress(customerId, oldAddressId);

  const {
    deleteCustomerAddress,
    loading: deleting,
    error: errorDelete,
  } = useDeleteCustomerAddress(customerId);

  const { reload: reloadJobs } = useCustomerJobs(customerId, {}, "desc");

  const error = errorUpdate ?? errorDelete;

  const handleSave = async () => {
    if (!selected) return;
    try {
      await updateJobAddress(selected);
      await deleteCustomerAddress(oldAddressId);
      onUpdated();
      reloadJobs();
      onClose();
    } catch (err) {
      console.error("Error updating job address:", err);
    }
  };

  const loading = saving || deleting;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="reassign-job-address"
    >
      <DialogTitle id="reassign-job-address">Reassign Job Address</DialogTitle>
      <DialogContent dividers>
        <AddressSelector
          value={selected}
          onChange={setSelected}
          excludeValues={[oldAddressId]}
          customerId={customerId}
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Failed to update job address. Please try again.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selected || loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
