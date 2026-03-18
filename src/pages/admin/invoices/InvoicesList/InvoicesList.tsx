import { FC } from "react";
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

export const InvoicesList: FC = () => {
  const { invoices, loading, loadingMore, error, hasMore, loadMore } =
    useInvoicesInfinite();

  const isEmpty = !loading && !error && invoices.length === 0;

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
              <InvoicesTable invoices={invoices} />

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
