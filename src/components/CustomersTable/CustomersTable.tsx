import { FC } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  Alert,
  Paper,
  useMediaQuery,
  CardContent,
  Typography,
  CardActions,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link as RouterLink } from "react-router-dom";

import { Customer } from "../../types/types";
import { DeleteCustomerButton } from "../DeleteCustomerButton/DeleteCustomerButton";
import {
  CustomerCard,
  CustomerCardLink,
  TableCellWrap,
  CustomerCardActionsSx,
  LinkStyle,
} from "./CustomerTable.style";
import { theme } from "../../theme";

type CustomersTableProps = {
  customers: Customer[];
  onReload?: () => void;
};

export const CustomersTable: FC<CustomersTableProps> = ({
  customers,
  onReload,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (customers.length === 0) {
    return <Alert severity="warning">No customers found</Alert>;
  }

  const toCustomer = (slug: string) =>
    `/admin/customers/${slug.replace(/^\/+/, "")}`;

  const formatMaybe = (value?: string | null) =>
    value && value.trim() ? value : "—";

  return isMobile ? (
    <Stack spacing={2}>
      {customers.map((customer) => (
        <CustomerCard key={customer.id} variant="outlined">
          <CustomerCardLink to={toCustomer(customer.slug)} style={LinkStyle}>
            <CardContent sx={{ pb: 1.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    noWrap
                    title={customer.name}
                  >
                    {customer.name}
                  </Typography>
                </Stack>

                <Chip
                  label="View"
                  size="small"
                  variant="outlined"
                  component={RouterLink}
                  to={toCustomer(customer.slug)}
                />
              </Stack>

              <Stack direction="row" gap={1.25} sx={{ mt: 1.5 }}>
                <LocationOnOutlinedIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {formatMaybe(customer.address)}
                  <br />
                  {formatMaybe(customer.postcode)}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1}>
                <Stack direction="row" gap={1.25}>
                  <PhoneOutlinedIcon fontSize="small" />
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {formatMaybe(customer.mainTelephone)}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Additional phone
                    </Typography>
                    <Typography variant="body2">
                      {formatMaybe(customer.secondTelephone)}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" gap={1.25}>
                  <AlternateEmailOutlinedIcon fontSize="small" />
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {formatMaybe(customer.email)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </CustomerCardLink>

          <CardActions {...CustomerCardActionsSx}>
            <Button
              component={RouterLink}
              to={toCustomer(customer.slug)}
              variant="contained"
              size="small"
            >
              Open
            </Button>

            <DeleteCustomerButton
              customerId={customer.id}
              onDelete={onReload}
            />
          </CardActions>
        </CustomerCard>
      ))}
    </Stack>
  ) : (
    <TableContainer component={Paper} sx={{ minWidth: 800, maxHeight: 600 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {[
              "Name",
              "Address",
              "Postcode",
              "Phone",
              "Additional phone",
              "Email",
              "Actions",
            ].map((header) => (
              <TableCellWrap
                key={header}
                align={header === "Name" ? "left" : "right"}
              >
                {header}
              </TableCellWrap>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {customers.map((customer, index) => (
            <TableRow
              key={customer.id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              }}
            >
              <TableCell component="th" scope="row">
                <RouterLink to={toCustomer(customer.slug)} style={LinkStyle}>
                  {customer.name}
                </RouterLink>
              </TableCell>
              <TableCell align="right">{customer.address}</TableCell>
              <TableCell align="right">{customer.postcode}</TableCell>
              <TableCell align="right">{customer.mainTelephone}</TableCell>
              <TableCell align="right">{customer.secondTelephone}</TableCell>
              <TableCell align="right">{customer.email}</TableCell>
              <TableCell align="right">
                <DeleteCustomerButton
                  customerId={customer.id}
                  onDelete={onReload}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
