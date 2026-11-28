import { FC, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useCustomerSearch } from "../../hooks/Customers/useCustomerSearch";
import { Customer } from "../../types/types";
import { ModalBox } from "./CustomerSelector.style";

type CustomerSelectorProps = {
  onSelectCustomer: (customer: Customer) => void;
};

export const CustomerSelector: FC<CustomerSelectorProps> = ({
  onSelectCustomer,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { customers, loading, error } = useCustomerSearch(searchInput);
  const hasNoCustomers =
    searchInput.trim() === "" && !loading && !error && customers.length === 0;
  return (
    <ModalBox>
      <Autocomplete
        options={customers}
        value={selectedCustomer}
        onChange={(_event, customer) => setSelectedCustomer(customer)}
        onInputChange={(_event, value, reason) => {
          if (reason === "input" || reason === "clear") {
            setSearchInput(value);
          }
        }}
        getOptionLabel={(customer) => customer.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(customers) => customers}
        loading={loading}
        loadingText="Searching customers..."
        noOptionsText={
          error ? "Could not load customers" : "No matching customers"
        }
        sx={{ width: "94%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Customer"
            sx={{ p: 2, mt: 2 }}
            fullWidth
          />
        )}
      />

      {hasNoCustomers && (
        <Stack spacing={2} sx={{ p: 2 }}>
          <Alert severity="warning">
            There is no customer to assign a job. Please create a customer
            first.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/customers")}
            sx={{ alignSelf: "flex-start" }}
          >
            Create Customer
          </Button>
        </Stack>
      )}

      <TextField
        disabled
        label="Address"
        value={selectedCustomer?.address ?? ""}
        sx={{ p: 2 }}
      />
      <TextField
        disabled
        label="Postcode"
        value={selectedCustomer?.postcode ?? ""}
        sx={{ p: 2 }}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (selectedCustomer) {
            onSelectCustomer(selectedCustomer);
          }
        }}
        disabled={!selectedCustomer}
        sx={{ m: 2 }}
      >
        Next
      </Button>
    </ModalBox>
  );
};
