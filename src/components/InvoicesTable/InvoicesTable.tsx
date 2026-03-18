import { FC } from "react";
import {
  Alert,
  Button,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import dayjs from "dayjs";

import { InvoiceWithAddress } from "../../types/types";
import { theme } from "../../theme";
import { TableCellWrap } from "../CustomersTable/CustomerTable.style";
import {
  InvoiceCard,
  InvoiceCardActions,
  InvoiceNumberCell,
  AddressCellContent,
} from "./InvoicesTable.style";
import { DownloadInvoiceButton } from "../DownloadInvoiceButton/DownloadInvoiceButton";

type InvoicesTableProps = {
  invoices: InvoiceWithAddress[];
  onReload?: (invoice: InvoiceWithAddress) => void;
};

const COLUMN_HEADERS: { name: string; align: "left" | "right" }[] = [
  { name: "Invoice #", align: "left" },
  { name: "Date", align: "left" },
  { name: "Address", align: "left" },
  { name: "Description", align: "left" },
  { name: "Actions", align: "right" },
];

export const InvoicesTable: FC<InvoicesTableProps> = ({ invoices }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (invoices.length === 0) {
    return <Alert severity="warning">No invoices found</Alert>;
  }

  const sortedInvoices = [...invoices].sort((a, b) => b.date - a.date);

  const formatDate = (date: number) => dayjs(date).format("YYYY-MM-DD");

  const formatMaybe = (value?: string | null) =>
    value && value.trim() ? value : "—";

  const formatAddressLine = (invoice: InvoiceWithAddress) => {
    const address = invoice.address?.address?.trim();
    const postcode = invoice.address?.postcode?.trim();

    if (address && postcode) {
      return `${address} ${postcode}`;
    }

    if (address) {
      return address;
    }

    if (postcode) {
      return postcode;
    }

    return "—";
  };

  const formatAddressName = (invoice: InvoiceWithAddress) =>
    formatMaybe(invoice.address?.name);

  return isMobile ? (
    <Stack spacing={2}>
      {sortedInvoices.map((invoice) => (
        <InvoiceCard key={invoice.jobId} variant="outlined">
          <CardContent sx={{ pb: 1.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
                <ReceiptLongOutlinedIcon fontSize="small" />
                <Typography
                  variant="h6"
                  fontWeight={800}
                  noWrap
                  title={invoice.invoiceNumber}
                >
                  {invoice.invoiceNumber}
                </Typography>
              </Stack>

              <Chip label="Invoice" size="small" variant="outlined" />
            </Stack>

            <Stack direction="row" gap={1.25} sx={{ mt: 1.5 }}>
              <CalendarMonthOutlinedIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(invoice.date)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack direction="row" gap={1.25}>
              <HomeWorkOutlinedIcon fontSize="small" />
              <Stack spacing={0.25}>
                <Typography variant="caption" color="text.secondary">
                  Address name
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatAddressName(invoice)}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatAddressLine(invoice)}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack direction="row" gap={1.25}>
              <DescriptionOutlinedIcon fontSize="small" />
              <Stack spacing={0.25}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body2">
                  {formatMaybe(invoice.description)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>

          <InvoiceCardActions>
            <DownloadInvoiceButton
              job={{
                id: invoice.jobId,
                customerId: invoice.address.customerId,
              }}
            />
          </InvoiceCardActions>
        </InvoiceCard>
      ))}
    </Stack>
  ) : (
    <TableContainer
      component={Paper}
      sx={{ minWidth: 950, maxHeight: 600, overflowX: "auto" }}
    >
      <Table stickyHeader aria-label="invoices table">
        <TableHead>
          <TableRow>
            {COLUMN_HEADERS.map(({ name, align }) => (
              <TableCellWrap key={name} align={align}>
                {name}
              </TableCellWrap>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedInvoices.map((invoice, index) => (
            <TableRow
              key={invoice.jobId}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              }}
            >
              <InvoiceNumberCell component="th" scope="row">
                {invoice.invoiceNumber}
              </InvoiceNumberCell>

              <TableCell align="left">{formatDate(invoice.date)}</TableCell>

              <TableCell align="left">
                <AddressCellContent>
                  <Typography variant="body2" fontWeight={700}>
                    {formatAddressName(invoice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatAddressLine(invoice)}
                  </Typography>
                </AddressCellContent>
              </TableCell>

              <TableCell align="left">
                {formatMaybe(invoice.description)}
              </TableCell>

              <TableCell align="right">
                <DownloadInvoiceButton
                  job={{
                    id: invoice.jobId,
                    customerId: invoice.address.customerId,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
