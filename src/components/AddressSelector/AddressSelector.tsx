import { FC, useState } from "react";
import { Customer, CustomerCleaningAddress } from "../../types/types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useCustomers } from "../../hooks/Customers/useCustomers";
import {
  Alert,
  Button,
  Stack,
  TextField,
  Grid,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ModalBox, SkeletonWrapper } from "./AddressSelector.style";
import { useNavigate } from "react-router-dom";

type AddressSelectorProps = {
  onSelectAddress: (address: CustomerCleaningAddress) => void;
};

export const AddressSelector: FC<AddressSelectorProps> = ({
  onSelectAddress,
}) => {
  const { customers, loading } = useCustomers({
    disablePagination: true,
    includeAddresses: true,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerCleaningAddress | null>(null);
  const [isCustomerWithoutAddress, setIsCustomerWithoutAddress] =
    useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: Customer) =>
      `${option.name} - ${option.address} - ${option.email} - ${option.postcode}`,
  });

  const nextHandler = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
    }
  };

  const selectCustomerHandler = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer?.cleaningAddresses?.length === 0) {
      setIsCustomerWithoutAddress(true);
      setButtonDisabled(true);
    } else if (customer?.cleaningAddresses?.length === 1) {
      setSelectedAddress(customer.cleaningAddresses[0]);
      setIsCustomerWithoutAddress(false);
      setButtonDisabled(false);
    } else {
      setIsCustomerWithoutAddress(false);
      setButtonDisabled(true);
    }
  };

  const selectAddressHandler = (addressId: string) => {
    const address = selectedCustomer?.cleaningAddresses?.find(
      (address) => address.id === addressId
    );
    setButtonDisabled(!address);
    if (address) {
      setSelectedAddress({ ...address, customerId: selectedCustomer?.id });
    } else {
      setSelectedAddress(null);
    }
  };

  if (loading) {
    return (
      <SkeletonWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Skeleton variant="text" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
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
            onChange={(_event, value) => selectCustomerHandler(value)}
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
          {selectedCustomer && (
            <>
              {isCustomerWithoutAddress ? (
                <Stack spacing={2} sx={{ p: 2 }}>
                  <Alert severity="warning">
                    This customer does not have addresses. Please create the
                    first address.
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(`/admin/customers/${selectedCustomer?.slug}`)
                    }
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Edit Customer
                  </Button>
                </Stack>
              ) : selectedCustomer?.cleaningAddresses?.length === 1 ? (
                <>
                  <TextField
                    disabled
                    label="Address"
                    value={selectedAddress?.address ?? ""}
                    sx={{ p: 2 }}
                  />
                  <TextField
                    disabled
                    label="Postcode"
                    value={selectedAddress?.postcode ?? ""}
                    sx={{ p: 2 }}
                  />
                </>
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Address</InputLabel>
                  <Select
                    value={selectedAddress?.id}
                    label="Age"
                    onChange={(e) =>
                      selectAddressHandler(e.target.value as string)
                    }
                  >
                    {selectedCustomer?.cleaningAddresses?.map((address) => (
                      <MenuItem value={address.id} key={address.id}>
                        {address.address ?? address.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

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
