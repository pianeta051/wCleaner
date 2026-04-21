import { FC, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Toolbar,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

import { InvoicesTable } from "../../../../components/InvoicesTable/InvoicesTable";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { Title, Wrapper } from "./InvoicesList.style";
import { useInvoicesInfinite } from "../../../../hooks/Jobs/useInvoicesInfinite";
import { InvoicesFilters } from "../InvoicesFilters/InvoicesFilters";

export type SortableColumnId = "invoiceNumber" | "invoiceDate";
export type SortDirection = "asc" | "desc";

export const InvoicesList: FC = () => {
  const [sortBy, setSortBy] = useState<SortableColumnId>("invoiceNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  const { invoices, loading, loadingMore, error, hasMore, loadMore } =
    useInvoicesInfinite({
      sorting: {
        sortBy,
        direction: sortDirection,
      },
      filters: {
        from: dateFrom?.startOf("day").valueOf(),
        to: dateTo?.endOf("day").valueOf(),
      },
    });

  const isEmpty = !loading && !error && invoices.length === 0;

  const changeSortingHandler = (newSorting: {
    sortBy: SortableColumnId;
    direction: SortDirection;
  }) => {
    setSortBy(newSorting.sortBy);
    setSortDirection(newSorting.direction);
  };

  return (
    <Wrapper>
      <Toolbar />
      <Title>Invoices</Title>

      <Grid container spacing={2}>
        <Grid size={12}>
          <InvoicesFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClear={() => {
              setDateFrom(null);
              setDateTo(null);
            }}
          />
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
              />

              {hasMore ? (
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  disabled={loadingMore}
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
