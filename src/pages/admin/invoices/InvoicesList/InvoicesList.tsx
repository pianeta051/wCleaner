import { FC, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Toolbar,
} from "@mui/material";
import { Dayjs } from "dayjs";

import { InvoicesTable } from "../../../../components/InvoicesTable/InvoicesTable";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { Title, Wrapper } from "./InvoicesList.style";
import { useInvoicesInfinite } from "../../../../hooks/Jobs/useInvoicesInfinite";
import { InvoicesFilters } from "../../../../components/InvoicesFilters/InvoicesFilters";

export type SortableColumnId = "invoiceNumber" | "invoiceDate";
export type SortDirection = "asc" | "desc";
type PaidFilter = "all" | "paid" | "unpaid";

export const InvoicesList: FC = () => {
  const [sortBy, setSortBy] = useState<SortableColumnId>("invoiceNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");

  const hasInvalidRange =
    !!dateFrom &&
    !!dateTo &&
    dateFrom.startOf("day").valueOf() > dateTo.endOf("day").valueOf();

  const paid = paidFilter === "all" ? undefined : paidFilter === "paid";

  const invoicesParams = useMemo(
    () => ({
      sorting: {
        sortBy,
        direction: sortDirection,
      },
      filters: hasInvalidRange
        ? undefined
        : {
            from: dateFrom?.startOf("day").valueOf(),
            to: dateTo?.endOf("day").valueOf(),
            paid,
          },
    }),
    [sortBy, sortDirection, dateFrom, dateTo, hasInvalidRange, paid]
  );

  const { invoices, loading, loadingMore, error, hasMore, loadMore, reload } =
    useInvoicesInfinite(invoicesParams);

  const isEmpty = !loading && !error && invoices.length === 0;

  const changeSortingHandler = (newSorting: {
    sortBy: SortableColumnId;
    direction: SortDirection;
  }) => {
    setSortBy(newSorting.sortBy);
    setSortDirection(newSorting.direction);
  };

  const handlePaidFilterChange = (event: SelectChangeEvent<PaidFilter>) => {
    setPaidFilter(event.target.value as PaidFilter);
  };

  return (
    <Wrapper>
      <Toolbar />
      <Title>Invoices</Title>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "flex-start" }}
            >
              <InvoicesFilters
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onClear={() => {
                  setDateFrom(null);
                  setDateTo(null);
                  setPaidFilter("all");
                }}
                hasInvalidRange={hasInvalidRange}
              />

              <FormControl size="small" sx={{ width: 160 }}>
                <InputLabel id="paid-filter-label">Paid</InputLabel>
                <Select
                  labelId="paid-filter-label"
                  value={paidFilter}
                  label="Paid"
                  onChange={handlePaidFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {hasInvalidRange ? (
              <Alert severity="warning">
                The “From” date cannot be later than the “To” date.
              </Alert>
            ) : null}
          </Stack>
        </Grid>

        <Grid size={12}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <ErrorMessage code={error} />
          ) : isEmpty ? (
            <Alert severity="info">No invoices found</Alert>
          ) : (
            <Stack spacing={2}>
              <InvoicesTable
                invoices={invoices}
                sorting={{ sortBy, direction: sortDirection }}
                setSorting={changeSortingHandler}
                onReload={() => {
                  void reload();
                }}
              />

              {hasMore ? (
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  disabled={loadingMore || hasInvalidRange}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </Button>
              ) : null}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Wrapper>
  );
};
