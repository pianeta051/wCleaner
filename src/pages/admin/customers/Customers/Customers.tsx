import { FC, useState } from "react";

import {
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
} from "@mui/material";
import { Wrapper, Title, New } from "./Customers.style";
import { addCustomer, getCustomers } from "../../../../services/customers";
import { NewCustomerModal } from "../../../../components/Customer/NewCustomerModal/NewCustomerModal";
import { Customer } from "../../../../types/types";
import { Link } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

export const Customers: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const customers = getCustomers();
  const closeHandler = () => {
    setModalOpen(false);
  };
  const openHandler = () => {
    setModalOpen(true);
  };
  const submitHandler = (customer: Customer) => {
    addCustomer(customer);
    setModalOpen(false);
  };
  return (
    <Wrapper>
      <New>
        <Button variant="contained" onClick={openHandler}>
          <PersonAddAltIcon />
        </Button>
      </New>
      <Title>Customers</Title>

      <Paper elevation={3}>
        {customers.length === 0 && (
          <div className="text-center">
            <h2>No customer found at the moment</h2>
          </div>
        )}

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Address</TableCell>
                <TableCell align="right">Postcode</TableCell>
                <TableCell align="right">Phone</TableCell>
                <TableCell align="right">Additinal phone</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers &&
                customers.map((customer) => (
                  <TableRow
                    key={customer.url}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    component="th"
                    scope="row"
                  >
                    <TableCell component="th" scope="row">
                      <Link to={customer.url}>{customer.name}</Link>
                    </TableCell>
                    <TableCell align="right">{customer.address}</TableCell>
                    <TableCell align="right">{customer.postcode}</TableCell>
                    <TableCell align="right">
                      {customer.mainTelephone}
                    </TableCell>
                    <TableCell align="right">
                      {customer.secondTelephone}
                    </TableCell>
                    <TableCell align="right">{customer.email}</TableCell>
                    <TableCell align="right">
                      <Link
                        to={`edit/${customer.url}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <CreateIcon />{" "}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <NewCustomerModal
        open={modalOpen}
        onClose={closeHandler}
        onSubmit={submitHandler}
      />
    </Wrapper>
  );
};
