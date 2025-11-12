import { FC } from "react";
import { useCustomerAddresses } from "../../hooks/Customers/addresses/useCustomerAddresses";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export type Address = {
  id: string;
  name: string;
  address: string;
  postcode: string;
};

type AddressSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  excludeValues?: string[];
  customerId: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export const AddressSelector: FC<AddressSelectorProps> = ({
  value,
  onChange,
  excludeValues,
  customerId,
  onBlur,
  error,
}) => {
  const {
    addresses,
    loading,
    error: errorLoadingAddresses,
  } = useCustomerAddresses(customerId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const addressOptions =
    addresses?.filter((address) => !excludeValues?.includes(address.id)) ?? [];

  if (!addressOptions.length) {
    return (
      <>
        <Typography color="error" sx={{ py: 2 }}>
          No addresses available for this customer.
        </Typography>
        {errorLoadingAddresses && (
          <Typography>{errorLoadingAddresses}</Typography>
        )}
      </>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="address-select-label">Select Address</InputLabel>
      <Select
        labelId="address-select-label"
        value={value}
        label="Select Address"
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
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
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </FormControl>
  );
};
