import { FC, useState } from "react";
import { Customer } from "../../types/types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useCustomers } from "../../hooks/Customers/useCustomers";
import { Alert, Button, Stack, TextField, Grid, Skeleton } from "@mui/material";
import { ModalBox, SkeletonWrapper } from "./CustomerSelector.style";
import { useNavigate } from "react-router-dom";

type CustomerSelectorProps = {
  onSelectCustomer: (customer: Customer) => void;
};

export const CustomerSelector: FC<CustomerSelectorProps> = ({
  onSelectCustomer,
}) => {
  const { customers, loading } = useCustomers(undefined, undefined, true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: Customer) =>
      `${option.name} - ${option.address} - ${option.email} - ${option.postcode}`,
  });

  const nextHandler = () => {
    if (selectedCustomer) {
      onSelectCustomer(selectedCustomer);
    }
  };

  if (loading) {
    return (
      <SkeletonWrapper>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Skeleton variant="text" height={56} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Skeleton variant="text" height={56} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Skeleton variant="text" height={56} />
          </Grid>
        </Grid>
      </SkeletonWrapper>
    );
  }

  return (
    <ModalBox>
      {!customers || customers.length === 0 ? (
        <Stack spacing={2} sx={{ p: 2 }}>
          <Alert severity="warning">
            There is no customer to assign a job. Please create a customer
            first.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/customers")}
            sx={{ alignSelf: "flex-start" }}
          >
            Create Customer
          </Button>
        </Stack>
      ) : (
        <>
          <Autocomplete
            options={customers}
            onChange={(_event, value) => {
              setSelectedCustomer(value ?? null);
              setButtonDisabled(!value);
            }}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
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
            onClick={nextHandler}
            disabled={buttonDisabled}
            sx={{ m: 2 }}
          >
            Next
          </Button>
        </>
      )}
    </ModalBox>
  );
};
