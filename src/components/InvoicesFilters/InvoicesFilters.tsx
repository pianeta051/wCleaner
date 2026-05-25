import { FC } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

import {
  ClearButton,
  FiltersStack,
  FiltersWrapper,
  datePickerTextFieldSx,
} from "./InvoicesFilters.style";

type InvoicesFiltersProps = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  onDateFromChange: (value: Dayjs | null) => void;
  onDateToChange: (value: Dayjs | null) => void;
  onClear: () => void;
  hasInvalidRange?: boolean;
};

export const InvoicesFilters: FC<InvoicesFiltersProps> = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
  hasInvalidRange = false,
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

        <ClearButton variant="text" onClick={onClear}>
          Clear filters
        </ClearButton>
      </FiltersStack>
    </FiltersWrapper>
  );
};
