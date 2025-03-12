import { FC } from "react";
import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Customer } from "../../types/types";
import { DeleteCustomerButton } from "../DeleteCustomerButton/DeleteCustomerButton";

type CustomersTableProps = {
  customers: Customer[];
};

export const CustomersTable: FC<CustomersTableProps> = ({ customers }) => {
  if (customers.length === 0) {
    return <Alert severity="warning">No customers found</Alert>;
  }
  return (
    <TableContainer component={Grid}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Postcode</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Additional phone</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers &&
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                sx={{
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
                  <DeleteCustomerButton customerId={customer.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
