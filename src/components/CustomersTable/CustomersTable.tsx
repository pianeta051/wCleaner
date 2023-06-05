import { FC } from "react";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ButtonWrapper } from "./CustomersTable.style";
import CreateIcon from "@mui/icons-material/Create";
import { Customer } from "../../types/types";

type CustomersTableProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
};

export const CustomersTable: FC<CustomersTableProps> = ({
  customers,
  onEdit,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
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
                key={customer.url}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Link to={customer.url}>{customer.name}</Link>
                </TableCell>
                <TableCell align="right">{customer.address}</TableCell>
                <TableCell align="right">{customer.postcode}</TableCell>
                <TableCell align="right">{customer.mainTelephone}</TableCell>
                <TableCell align="right">{customer.secondTelephone}</TableCell>
                <TableCell align="right">{customer.email}</TableCell>
                <TableCell align="right">
                  <ButtonWrapper>
                    <IconButton
                      onClick={() => onEdit(customer)}
                      aria-label="edit customer"
                    >
                      <CreateIcon />
                    </IconButton>
                  </ButtonWrapper>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
