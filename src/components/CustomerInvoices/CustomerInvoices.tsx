import { FC } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { Link as RouterLink } from "react-router-dom";

import dayjs from "dayjs";
import { useCustomerInvoices } from "../../hooks/Invoices/useCustomerInvoices";

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
            {invoices.map((invoice) => {
              const invoiceUrl = `/admin/customers/${invoice.customerId}/jobs/${invoice.jobId}/invoice`;

              return (
                <ListItem
                  key={invoice.jobId}
                  disablePadding
                  secondaryAction={
                    <Tooltip title="Download invoice">
                      <IconButton
                        edge="end"
                        component="a"
                        href={invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to={invoiceUrl}
                    target="_blank"
                  >
                    <ListItemText
                      primary={invoice.invoiceNumber}
                      secondary={dayjs(invoice.date).format("DD MMM YYYY")}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
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
