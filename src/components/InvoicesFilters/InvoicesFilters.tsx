import { FC } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

import {
  ClearButton,
  FiltersStack,
  FiltersWrapper,
  datePickerTextFieldSx,
} from "./InvoicesFilters.style";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { PaidFilter } from "../../pages/admin/invoices/InvoicesList/InvoicesList";

type InvoicesFiltersProps = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  onDateFromChange: (value: Dayjs | null) => void;
  onDateToChange: (value: Dayjs | null) => void;
  onClear: () => void;
  hasInvalidRange?: boolean;
  paidFilter: PaidFilter;
  onPaidFilterChange: (filter: PaidFilter) => void;
};

export const InvoicesFilters: FC<InvoicesFiltersProps> = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
  hasInvalidRange = false,
  paidFilter,
  onPaidFilterChange,
}) => {
  return (
    <FiltersWrapper>
      <FiltersStack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <DatePicker
          label="From"
          value={dateFrom}
          onChange={onDateFromChange}
          slotProps={{
            textField: {
              size: "small",
              sx: datePickerTextFieldSx,
              error: hasInvalidRange,
            },
          }}
        />

        <DatePicker
          label="To"
          value={dateTo}
          onChange={onDateToChange}
          slotProps={{
            textField: {
              size: "small",
              sx: datePickerTextFieldSx,
              error: hasInvalidRange,
            },
          }}
        />

        <FormControl size="small" sx={{ width: 160 }}>
          <InputLabel id="paid-filter-label">Paid</InputLabel>
          <Select
            labelId="paid-filter-label"
            value={paidFilter}
            label="Paid"
            onChange={(event) => onPaidFilterChange(event.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>

        <ClearButton variant="text" onClick={onClear}>
          Clear filters
        </ClearButton>
      </FiltersStack>
    </FiltersWrapper>
  );
};
