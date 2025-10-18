import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { getCustomerAddressses } from "../../services/customers";
import { useUpdateJobAddress } from "../../hooks/Jobs/useUpdateJobAddress";
import { useDeleteCustomerAddress } from "../../hooks/Customers/addresses/useDeleteCustomerAddress";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";

type Address = {
  id: string;
  name: string;
  address: string;
  postcode: string;
};

type AddressSelectorProps = {
  open: boolean;
  onClose: () => void;
  customerId: string;
  onUpdated: () => void;
  oldAddressId: string;
};

export const AddressSelector: FC<AddressSelectorProps> = ({
  open,
  onClose,
  customerId,
  onUpdated,
  oldAddressId,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true);

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

  useEffect(() => {
    if (!open) return;

    setLoadingAddresses(true);
    getCustomerAddressses(customerId)
      .then((res: Address[]) => {
        setAddresses(res);
        if (res.length) setSelected(res[0].id);
      })
      .catch((err) => {
        console.error("Failed to load addresses:", err);
        setAddresses([]);
      })
      .finally(() => setLoadingAddresses(false));
  }, [open, customerId]);

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
  const addressOptions = addresses.filter(
    (address) => address.id !== oldAddressId
  );

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
        {loadingAddresses ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : addressOptions.length > 0 ? (
          <FormControl fullWidth>
            <InputLabel id="address-select-label">Select Address</InputLabel>
            <Select
              labelId="address-select-label"
              value={selected}
              label="Select Address"
              onChange={(e) => setSelected(e.target.value)}
            >
              {addressOptions.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  <Box display="flex" flexDirection="column">
                    <Typography fontWeight="500">{a.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {a.address}, {a.postcode}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography color="error" sx={{ py: 2 }}>
            No addresses available for this customer.
          </Typography>
        )}

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
