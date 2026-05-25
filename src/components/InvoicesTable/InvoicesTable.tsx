import { FC } from "react";
import {
  Alert,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
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
import {
  SortableColumnId,
  SortDirection,
} from "../../pages/admin/invoices/InvoicesList/InvoicesList";
import { InvoicePaidToggle } from "../../hooks/Jobs/InvoicePaidToogle/InvoicePaidToogle";

type InvoicesTableProps = {
  invoices: InvoiceWithAddress[];
  onReload?: () => void;
  sorting: {
    sortBy: SortableColumnId;
    direction: SortDirection;
  };
  setSorting: (newSorting: {
    sortBy: SortableColumnId;
    direction: SortDirection;
  }) => void;
};

type ColumnHeader = {
  label: string;
  align: "left" | "right";
  id:
    | "invoiceNumber"
    | "invoiceDate"
    | "address"
    | "description"
    | "paid"
    | "actions";
  sortable?: boolean;
};

type MobileSortOption =
  | "newest"
  | "oldest"
  | "highestInvoiceNumber"
  | "lowestInvoiceNumber";

const COLUMN_HEADERS: ColumnHeader[] = [
  { label: "Invoice #", align: "left", id: "invoiceNumber", sortable: true },
  { label: "Date", align: "left", id: "invoiceDate", sortable: true },
  { label: "Address", align: "left", id: "address" },
  { label: "Description", align: "left", id: "description" },
  { label: "Paid", align: "left", id: "paid" },
  { label: "Actions", align: "right", id: "actions" },
];

export const InvoicesTable: FC<InvoicesTableProps> = ({
  invoices,
  sorting,
  setSorting,
  onReload,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formatDate = (date: number) => dayjs(date).format("YYYY-MM-DD");

  const formatMaybe = (value?: string | null) =>
    value && value.trim() ? value : "—";

  const getCustomerId = (invoice: InvoiceWithAddress) =>
    invoice.customerId ?? invoice.address?.customerId;

  const formatAddressLine = (invoice: InvoiceWithAddress) => {
    const address = invoice.address?.address?.trim();
    const postcode = invoice.address?.postcode?.trim();

    if (address && postcode) return `${address} ${postcode}`;
    if (address) return address;
    if (postcode) return postcode;

    return "—";
  };

  const formatAddressName = (invoice: InvoiceWithAddress) =>
    formatMaybe(invoice.address?.name);

  const handleSortChange = (columnId: SortableColumnId) => {
    if (columnId === sorting.sortBy) {
      setSorting({
        sortBy: columnId,
        direction: sorting.direction === "asc" ? "desc" : "asc",
      });
      return;
    }

    setSorting({
      sortBy: columnId,
      direction: "desc",
    });
  };

  const getMobileSortOptionValue = (): MobileSortOption => {
    if (sorting.sortBy === "invoiceDate" && sorting.direction === "desc") {
      return "newest";
    }

    if (sorting.sortBy === "invoiceDate" && sorting.direction === "asc") {
      return "oldest";
    }

    if (sorting.sortBy === "invoiceNumber" && sorting.direction === "desc") {
      return "highestInvoiceNumber";
    }

    return "lowestInvoiceNumber";
  };

  const handleMobileSortChange = (
    event: SelectChangeEvent<MobileSortOption>
  ) => {
    const option = event.target.value as MobileSortOption;

    switch (option) {
      case "newest":
        setSorting({ sortBy: "invoiceDate", direction: "desc" });
        break;
      case "oldest":
        setSorting({ sortBy: "invoiceDate", direction: "asc" });
        break;
      case "highestInvoiceNumber":
        setSorting({ sortBy: "invoiceNumber", direction: "desc" });
        break;
      case "lowestInvoiceNumber":
        setSorting({ sortBy: "invoiceNumber", direction: "asc" });
        break;
    }
  };

  if (invoices.length === 0) {
    return <Alert severity="warning">No invoices found</Alert>;
  }

  return isMobile ? (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel id="mobile-invoice-sort-label">Sort by</InputLabel>
        <Select
          labelId="mobile-invoice-sort-label"
          value={getMobileSortOptionValue()}
          label="Sort by"
          onChange={handleMobileSortChange}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
          <MenuItem value="highestInvoiceNumber">
            Highest invoice number
          </MenuItem>
          <MenuItem value="lowestInvoiceNumber">Lowest invoice number</MenuItem>
        </Select>
      </FormControl>

      {invoices.map((invoice) => {
        const customerId = getCustomerId(invoice);

        return (
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

              <Divider sx={{ my: 1.5 }} />

              {customerId ? (
                <InvoicePaidToggle
                  customerId={customerId}
                  jobId={invoice.jobId}
                  paid={invoice.paid}
                  onUpdated={onReload}
                />
              ) : null}
            </CardContent>

            <InvoiceCardActions>
              {customerId ? (
                <DownloadInvoiceButton
                  job={{
                    id: invoice.jobId,
                    customerId,
                  }}
                />
              ) : null}
            </InvoiceCardActions>
          </InvoiceCard>
        );
      })}
    </Stack>
  ) : (
    <TableContainer
      component={Paper}
      sx={{ minWidth: 950, maxHeight: 600, overflowX: "auto" }}
    >
      <Table stickyHeader aria-label="invoices table">
        <TableHead>
          <TableRow>
            {COLUMN_HEADERS.map(({ label, align, id, sortable }) => (
              <TableCellWrap key={id} align={align}>
                {sortable ? (
                  <TableSortLabel
                    active={sorting.sortBy === id}
                    direction={
                      sorting.sortBy === id ? sorting.direction : "desc"
                    }
                    onClick={() => handleSortChange(id as SortableColumnId)}
                  >
                    {label}
                  </TableSortLabel>
                ) : (
                  label
                )}
              </TableCellWrap>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {invoices.map((invoice, index) => {
            const customerId = getCustomerId(invoice);

            return (
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

                <TableCell align="left">
                  {customerId ? (
                    <InvoicePaidToggle
                      customerId={customerId}
                      jobId={invoice.jobId}
                      paid={invoice.paid}
                      onUpdated={onReload}
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell align="right">
                  {customerId ? (
                    <DownloadInvoiceButton
                      job={{
                        id: invoice.jobId,
                        customerId,
                      }}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
