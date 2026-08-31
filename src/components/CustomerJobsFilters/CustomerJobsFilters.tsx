import { FC, useRef, useState } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

import { JobFilters } from "../../types/types";
import {
  AddressFormControl,
  AssignedToFormControl,
  ClearButton,
  DateFilterField,
  FiltersStack,
  FiltersWrapper,
  JobTypeFormControl,
  PriceTextField,
} from "./CustomerJobsFilters.style";

import { useUsers } from "../../hooks/Users/useUsers";
import { useJobTypes } from "../../hooks/Jobs/useJobTypes";
import { useCustomerAddresses } from "../../hooks/Customers/addresses/useCustomerAddresses";
import useDebounce from "../../hooks/utils/useDebounce";

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

  const [, cancelDebounce] = useDebounce(
    () => {
      onChange(filters);
    },
    400,
    [filters]
  );

  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    const nextFilters: JobFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);
  };

  const startDateChangeHandler = (value: Dayjs | null) => {
    updateFilter(
      "start",
      value && value.isValid() ? value.format("YYYY-MM-DD") : undefined
    );
  };

  const endDateChangeHandler = (value: Dayjs | null) => {
    updateFilter(
      "end",
      value && value.isValid() ? value.format("YYYY-MM-DD") : undefined
    );
  };

  const clearFilters = () => {
    cancelDebounce();
    setFilters({});
    onClear();
  };

  return (
    <FiltersWrapper>
      <FiltersStack>
        <DateFilterField
          label="From date"
          format="DD/MM/YYYY"
          value={filters.start ? dayjs(filters.start) : null}
          onChange={startDateChangeHandler}
        />

        <DateFilterField
          label="To date"
          format="DD/MM/YYYY"
          value={filters.end ? dayjs(filters.end) : null}
          onChange={endDateChangeHandler}
          minDate={filters.start ? dayjs(filters.start) : undefined}
        />

        <PriceTextField
          label="Min price"
          type="number"
          size="small"
          value={filters.minPrice ?? ""}
          onChange={(event) => updateFilter("minPrice", +event.target.value)}
          slotProps={{
            htmlInput: {
              min: 0,
              step: "0.01",
            },
          }}
        />

        <PriceTextField
          label="Max price"
          type="number"
          size="small"
          value={filters.maxPrice ?? ""}
          onChange={(event) => updateFilter("maxPrice", +event.target.value)}
          slotProps={{
            htmlInput: {
              min: filters.minPrice ?? 0,
              step: "0.01",
            },
          }}
        />

        <AssignedToFormControl size="small">
          <InputLabel>Assigned To</InputLabel>

          <Select
            label="Assigned To"
            value={filters.assignedTo ?? ""}
            onChange={(event) =>
              updateFilter("assignedTo", event.target.value || undefined)
            }
          >
            <MenuItem value="">All users</MenuItem>

            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name ?? user.email}
              </MenuItem>
            ))}
          </Select>
        </AssignedToFormControl>

        <JobTypeFormControl size="small">
          <InputLabel>Job Type</InputLabel>

          <Select
            label="Job Type"
            value={filters.jobTypeId ?? ""}
            onChange={(event) =>
              updateFilter("jobTypeId", event.target.value || undefined)
            }
          >
            <MenuItem value="">All job types</MenuItem>

            {jobTypes.map((jobType) => (
              <MenuItem key={jobType.id} value={jobType.id}>
                {jobType.name}
              </MenuItem>
            ))}
          </Select>
        </JobTypeFormControl>

        <AddressFormControl size="small">
          <InputLabel>Address</InputLabel>

          <Select
            label="Address"
            value={filters.addressId ?? ""}
            onChange={(event) =>
              updateFilter("addressId", event.target.value || undefined)
            }
          >
            <MenuItem value="">All addresses</MenuItem>

            {addresses.map((address) => (
              <MenuItem key={address.id} value={address.id}>
                {address.name}
              </MenuItem>
            ))}
          </Select>
        </AddressFormControl>

        <ClearButton variant="text" onClick={clearFilters}>
          Clear filters
        </ClearButton>
      </FiltersStack>
    </FiltersWrapper>
  );
};
