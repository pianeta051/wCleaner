// import { FC, useState } from "react";
// import {
//   Alert,
//   Button,
//   CardContent,
//   Chip,
//   Divider,
//   Paper,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableSortLabel,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import dayjs from "dayjs";

// import { InvoiceWithAddress } from "../../types/types";
// import { theme } from "../../theme";
// import { TableCellWrap } from "../CustomersTable/CustomerTable.style";
// import {
//   InvoiceCard,
//   InvoiceCardActions,
//   InvoiceNumberCell,
//   AddressCellContent,
// } from "./InvoicesTable.style";
// import { DownloadInvoiceButton } from "../DownloadInvoiceButton/DownloadInvoiceButton";

// type InvoicesTableProps = {
//   invoices: InvoiceWithAddress[];
//   onReload?: (invoice: InvoiceWithAddress) => void;
// };

// type ColumnHeader = {
//   label: string;
//   align: "left" | "right";
//   id: string;
//   sortable?: boolean;
// };

// /**
//  * Sorting para moviles. Opciones
//  * Newest: sortBy: date, sortDirection: desc
//  * Oldest: sortBy: date, sortDirection: asc
//  * Highest invoice number: sortBy: invoice_numer, sortDirection: desc
//  * Lowest invoice number: sortBy: invoices_number, sortDirection: asc
//  */

// const COLUMN_HEADERS: ColumnHeader[] = [
//   { label: "Invoice #", align: "left", id: "invoiceNumber", sortable: true },
//   { label: "Date", align: "left", id: "date", sortable: true },
//   { label: "Address", align: "left", id: "address" },
//   { label: "Description", align: "left", id: "description" },
//   { label: "Actions", align: "right", id: "actions" },
// ];

// export const InvoicesTable: FC<InvoicesTableProps> = ({ invoices }) => {
//   const [sortBy, setSortBy] = useState<"invoiceNumber" | "date">("date");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const getInvoiceNumberValue = (invoice: InvoiceWithAddress) => {
//     const digits = invoice.invoiceNumber?.match(/\d+/g)?.join("") ?? "0";
//     return Number(digits);
//   };

//   if (invoices.length === 0) {
//     return <Alert severity="warning">No invoices found</Alert>;
//   }

//   // const sortedInvoices = [...invoices].sort((a, b) => b.date - a.date);
//   const sortedInvoices = [...invoices].sort((a, b) => {
//     let comparison = 0;

//     if (sortBy === "date") {
//       comparison = a.date - b.date;
//     }

//     if (sortBy === "invoiceNumber") {
//       comparison = getInvoiceNumberValue(a) - getInvoiceNumberValue(b);
//     }

//     return sortDirection === "asc" ? comparison : -comparison;
//   });

//   const formatDate = (date: number) => dayjs(date).format("YYYY-MM-DD");

//   const formatMaybe = (value?: string | null) =>
//     value && value.trim() ? value : "—";

//   const formatAddressLine = (invoice: InvoiceWithAddress) => {
//     const address = invoice.address?.address?.trim();
//     const postcode = invoice.address?.postcode?.trim();

//     if (address && postcode) {
//       return `${address} ${postcode}`;
//     }

//     if (address) {
//       return address;
//     }

//     if (postcode) {
//       return postcode;
//     }

//     return "—";
//   };

//   const formatAddressName = (invoice: InvoiceWithAddress) =>
//     formatMaybe(invoice.address?.name);
//   const handleMobileSortChange = (option: MobileSortOption) => {
//     switch (option) {
//       case "newest":
//         setSortBy("date");
//         setSortDirection("desc");
//         break;
//       case "oldest":
//         setSortBy("date");
//         setSortDirection("asc");
//         break;
//       case "highestInvoiceNumber":
//         setSortBy("invoiceNumber");
//         setSortDirection("desc");
//         break;
//       case "lowestInvoiceNumber":
//         setSortBy("invoiceNumber");
//         setSortDirection("asc");
//         break;
//     }
//   };

//   const handleSortChange = (columnId: string) => {
//     if (columnId === sortBy) {
//       // change only sortDirection
//       if (sortDirection === "asc") {
//         setSortDirection("desc");
//       } else {
//         setSortDirection("asc");
//       }
//     } else {
//       // change the column and restore the direction to default
//       setSortBy(columnId);
//       setSortDirection("desc");
//     }
//   };

//   return isMobile ? (
//     <Stack spacing={2}>
//       {sortedInvoices.map((invoice) => (
//         <InvoiceCard key={invoice.jobId} variant="outlined">
//           <CardContent sx={{ pb: 1.5 }}>
//             <Stack
//               direction="row"
//               alignItems="center"
//               justifyContent="space-between"
//               gap={2}
//             >
//               <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
//                 <ReceiptLongOutlinedIcon fontSize="small" />
//                 <Typography
//                   variant="h6"
//                   fontWeight={800}
//                   noWrap
//                   title={invoice.invoiceNumber}
//                 >
//                   {invoice.invoiceNumber}
//                 </Typography>
//               </Stack>

//               <Chip label="Invoice" size="small" variant="outlined" />
//             </Stack>

//             <Stack direction="row" gap={1.25} sx={{ mt: 1.5 }}>
//               <CalendarMonthOutlinedIcon fontSize="small" />
//               <Typography variant="body2" color="text.secondary">
//                 {formatDate(invoice.date)}
//               </Typography>
//             </Stack>

//             <Divider sx={{ my: 1.5 }} />

//             <Stack direction="row" gap={1.25}>
//               <HomeWorkOutlinedIcon fontSize="small" />
//               <Stack spacing={0.25}>
//                 <Typography variant="caption" color="text.secondary">
//                   Address name
//                 </Typography>
//                 <Typography variant="body2" fontWeight={600}>
//                   {formatAddressName(invoice)}
//                 </Typography>

//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{ mt: 0.5 }}
//                 >
//                   Address
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {formatAddressLine(invoice)}
//                 </Typography>
//               </Stack>
//             </Stack>

//             <Divider sx={{ my: 1.5 }} />

//             <Stack direction="row" gap={1.25}>
//               <DescriptionOutlinedIcon fontSize="small" />
//               <Stack spacing={0.25}>
//                 <Typography variant="caption" color="text.secondary">
//                   Description
//                 </Typography>
//                 <Typography variant="body2">
//                   {formatMaybe(invoice.description)}
//                 </Typography>
//               </Stack>
//             </Stack>
//           </CardContent>

//           <InvoiceCardActions>
//             <DownloadInvoiceButton
//               job={{
//                 id: invoice.jobId,
//                 customerId: invoice.address?.customerId ?? invoice.customerId,
//               }}
//             />
//           </InvoiceCardActions>
//         </InvoiceCard>
//       ))}
//     </Stack>
//   ) : (
//     <TableContainer
//       component={Paper}
//       sx={{ minWidth: 950, maxHeight: 600, overflowX: "auto" }}
//     >
//       <Table stickyHeader aria-label="invoices table">
//         <TableHead>
//           <TableRow>
//             {COLUMN_HEADERS.map(({ label, align, id, sortable }) => (
//               <TableCellWrap key={id} align={align}>
//                 {sortable ? (
//                   <TableSortLabel
//                     active={sortBy === id}
//                     direction={sortDirection}
//                     onClick={() =>
//                       handleSortChange(id as "invoiceNumber" | "date")
//                     }
//                   >
//                     {label}
//                   </TableSortLabel>
//                 ) : (
//                   <>{label}</>
//                 )}
//               </TableCellWrap>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {sortedInvoices.map((invoice, index) => (
//             <TableRow
//               key={invoice.jobId}
//               sx={{
//                 backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
//               }}
//             >
//               <InvoiceNumberCell component="th" scope="row">
//                 {invoice.invoiceNumber}
//               </InvoiceNumberCell>

//               <TableCell align="left">{formatDate(invoice.date)}</TableCell>

//               <TableCell align="left">
//                 <AddressCellContent>
//                   <Typography variant="body2" fontWeight={700}>
//                     {formatAddressName(invoice)}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {formatAddressLine(invoice)}
//                   </Typography>
//                 </AddressCellContent>
//               </TableCell>

//               <TableCell align="left">
//                 {formatMaybe(invoice.description)}
//               </TableCell>

//               <TableCell align="right">
//                 <DownloadInvoiceButton
//                   job={{
//                     id: invoice.jobId,
//                     customerId:
//                       invoice.address?.customerId ?? invoice.customerId,
//                   }}
//                 />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };
import { FC, useMemo, useState } from "react";
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

type InvoicesTableProps = {
  invoices: InvoiceWithAddress[];
  onReload?: (invoice: InvoiceWithAddress) => void;
};

type SortableColumnId = "invoiceNumber" | "date";
type SortDirection = "asc" | "desc";

type ColumnHeader = {
  label: string;
  align: "left" | "right";
  id: "invoiceNumber" | "date" | "address" | "description" | "actions";
  sortable?: boolean;
};

type MobileSortOption =
  | "newest"
  | "oldest"
  | "highestInvoiceNumber"
  | "lowestInvoiceNumber";

const COLUMN_HEADERS: ColumnHeader[] = [
  { label: "Invoice #", align: "left", id: "invoiceNumber", sortable: true },
  { label: "Date", align: "left", id: "date", sortable: true },
  { label: "Address", align: "left", id: "address" },
  { label: "Description", align: "left", id: "description" },
  { label: "Actions", align: "right", id: "actions" },
];

export const InvoicesTable: FC<InvoicesTableProps> = ({ invoices }) => {
  const [sortBy, setSortBy] = useState<SortableColumnId>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const getInvoiceNumberValue = (invoice: InvoiceWithAddress) => {
    if (
      "invoiceNumberRaw" in invoice &&
      typeof invoice.invoiceNumberRaw === "number"
    ) {
      return invoice.invoiceNumberRaw;
    }

    const digits = invoice.invoiceNumber?.match(/\d+/g)?.join("") ?? "0";
    return Number(digits);
  };

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = a.date - b.date;
          break;
        case "invoiceNumber":
          comparison = getInvoiceNumberValue(a) - getInvoiceNumberValue(b);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [invoices, sortBy, sortDirection]);

  const handleSortChange = (columnId: SortableColumnId) => {
    if (columnId === sortBy) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(columnId);
    setSortDirection("desc");
  };

  const getMobileSortOptionValue = (): MobileSortOption => {
    if (sortBy === "date" && sortDirection === "desc") {
      return "newest";
    }
    if (sortBy === "date" && sortDirection === "asc") {
      return "oldest";
    }
    if (sortBy === "invoiceNumber" && sortDirection === "desc") {
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
        setSortBy("date");
        setSortDirection("desc");
        break;
      case "oldest":
        setSortBy("date");
        setSortDirection("asc");
        break;
      case "highestInvoiceNumber":
        setSortBy("invoiceNumber");
        setSortDirection("desc");
        break;
      case "lowestInvoiceNumber":
        setSortBy("invoiceNumber");
        setSortDirection("asc");
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
                customerId: invoice.address?.customerId ?? invoice.customerId,
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
            {COLUMN_HEADERS.map(({ label, align, id, sortable }) => (
              <TableCellWrap key={id} align={align}>
                {sortable ? (
                  <TableSortLabel
                    active={sortBy === id}
                    direction={sortBy === id ? sortDirection : "desc"}
                    onClick={() => handleSortChange(id as SortableColumnId)}
                  >
                    {label}
                  </TableSortLabel>
                ) : (
                  <>{label}</>
                )}
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
                    customerId:
                      invoice.address?.customerId ?? invoice.customerId,
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
