import { FC, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { JobFilters } from "../../types/types";
import {
  ClearButton,
  FiltersStack,
  FiltersWrapper,
} from "./CustomerJobsFilters.style";

import { useUsers } from "../../hooks/Users/useUsers";
import { useJobTypes } from "../../hooks/Jobs/useJobTypes";
import { useCustomerAddresses } from "../../hooks/Customers/addresses/useCustomerAddresses";

type CustomerJobsFiltersProps = {
  customerId?: string;
  onChange: (filters: JobFilters) => void;
  onClear: () => void;
};

export const CustomerJobsFilters: FC<CustomerJobsFiltersProps> = ({
  customerId,
  onChange,
  onClear,
}) => {
  const { users } = useUsers();
  const { jobTypes = [] } = useJobTypes();
  const { addresses = [] } = useCustomerAddresses(customerId);

  const [filters, setFilters] = useState<JobFilters>({});

  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
    onChange(filters);
  };

  return (
    <FiltersWrapper>
      <FiltersStack direction={{ xs: "column", lg: "row" }} spacing={2}>
        <FormControl
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 250,
              md: 220,
            },
          }}
        >
          <InputLabel>Assigned To</InputLabel>

          <Select
            label="Assigned To"
            value={filters.assignedTo ?? ""}
            onChange={(event) => updateFilter("assignedTo", event.target.value)}
          >
            <MenuItem value="">All users</MenuItem>

            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name ?? user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Job Type</InputLabel>

          <Select
            label="Job Type"
            value={filters.jobTypeId ?? ""}
            onChange={(event) => updateFilter("jobTypeId", event.target.value)}
          >
            <MenuItem value="">All job types</MenuItem>

            {jobTypes.map((jobType) => (
              <MenuItem key={jobType.id} value={jobType.id}>
                {jobType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>Address</InputLabel>

          <Select
            label="Address"
            value={filters.addressId ?? ""}
            onChange={(event) => updateFilter("addressId", event.target.value)}
          >
            <MenuItem value="">All addresses</MenuItem>

            {addresses.map((address) => (
              <MenuItem key={address.id} value={address.id}>
                {address.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ClearButton
          variant="text"
          onClick={onClear}
          sx={{
            width: {
              xs: "100%",
              lg: "auto",
            },
            height: 40,
            alignSelf: {
              xs: "stretch",
              lg: "center",
            },
          }}
        >
          Clear filters
        </ClearButton>
      </FiltersStack>
    </FiltersWrapper>
  );
};
