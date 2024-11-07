import { FC, useState } from "react";
import { Customer } from "../../types/types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useCustomers } from "../../hooks/Customers/useCustomers";
import { Button, TextField } from "@mui/material";
import { ModalBox } from "./CustomerSelector.style";

type CustomerSelectorProps = { onSelectCustomer: (customer: Customer) => void };
export const CustomerSelector: FC<CustomerSelectorProps> = ({
  onSelectCustomer,
}) => {
  const { customers } = useCustomers(undefined, true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: Customer) =>
      `${option.name} - ${option.address} - ${option.email} - ${option.postcode}`,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const nextHandler = () => {
    if (selectedCustomer) {
      onSelectCustomer(selectedCustomer);
    }
  };
  return (
    <ModalBox>
      <Autocomplete
        options={customers}
        onChange={(_event, value) => {
          value ? setSelectedCustomer(value) : value;
          setButtonDisabled(false);
          if (value === null) {
            setButtonDisabled(true);
          }
        }}
        getOptionLabel={(option) => option.name}
        filterOptions={filterOptions}
        sx={{ width: "94%" }}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              label="Select Customer"
              sx={{ p: 2, mt: 2 }}
              fullWidth
            />
          </>
        )}
      />
      <TextField
        disabled
        label="Address"
        id="outlined-disabled"
        value={selectedCustomer?.address}
        sx={{ p: 2 }}
      />
      <TextField
        disabled
        label="Postcode"
        id="outlined-disabled"
        value={selectedCustomer?.postcode}
        sx={{ p: 2 }}
      />
      <Button disabled={buttonDisabled} onClick={nextHandler}>
        Next
      </Button>
    </ModalBox>
  );
};
