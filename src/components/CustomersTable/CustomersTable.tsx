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
} from "@mui/material";
import { Link } from "react-router-dom";
import { Customer } from "../../types/types";
import { DeleteCustomerButton } from "../DeleteCustomerButton/DeleteCustomerButton";
import { CustomerCard, TableCellWrap } from "./CustomerTable.style";
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

  return isMobile ? (
    <>
      {customers.map((customer) => (
        <CustomerCard key={customer.id}>
          <CardContent>
            <Typography variant="h5" component="div">
              <Link to={customer.slug}>{customer.name}</Link>
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
              {customer.address}
              <br />
              {customer.postcode}
            </Typography>
          </CardContent>

          <CardActions>
            <Button size="small">Delete</Button>
          </CardActions>
        </CustomerCard>
      ))}
    </>
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
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                <Link to={customer.slug}>{customer.name}</Link>
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
