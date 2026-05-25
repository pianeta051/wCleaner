import { FC } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import dayjs from "dayjs";
import { useCustomerInvoices } from "../../hooks/Jobs/useCustomerInvoices";

type Props = {
  customerId: string;
};

export const CustomerInvoices: FC<Props> = ({ customerId }) => {
  const { invoices, loading, error, moreToLoad, loadMore, loadingMore } =
    useCustomerInvoices(customerId);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Could not load invoices</Typography>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom mb={3}>
        Invoices
      </Typography>

      {!invoices.length ? (
        <Alert severity="info">No invoices found.</Alert>
      ) : (
        <>
          <List>
            {invoices.map((invoice) => (
              <ListItemButton
                key={invoice.jobId}
                component={RouterLink}
                to={`/admin/customers/${invoice.customerId}/jobs/${invoice.jobId}/invoice`}
                target="_blank"
              >
                <ListItemText
                  primary={invoice.invoiceNumber}
                  secondary={dayjs(invoice.date).format("DD MMM YYYY")}
                />
              </ListItemButton>
            ))}
          </List>
          {moreToLoad && (
            <Button variant="outlined" onClick={loadMore} loading={loadingMore}>
              Load more
            </Button>
          )}
        </>
      )}
    </>
  );
};
