import { FC, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Toolbar,
} from "@mui/material";

import { InvoicesTable } from "../../../../components/InvoicesTable/InvoicesTable";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { Title, Wrapper } from "./InvoicesList.style";
import { useInvoicesInfinite } from "../../../../hooks/Jobs/useInvoicesInfinite";

export type SortableColumnId = "invoiceNumber" | "invoiceDate";
export type SortDirection = "asc" | "desc";

export const InvoicesList: FC = () => {
  const [sortBy, setSortBy] = useState<SortableColumnId>("invoiceNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { invoices, loading, loadingMore, error, hasMore, loadMore } =
    useInvoicesInfinite({
      sorting: {
        sortBy,
        direction: sortDirection,
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
