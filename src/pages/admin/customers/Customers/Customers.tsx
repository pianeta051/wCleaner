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
import { Wrapper, Title, IconButton } from "./Customers.style";
import { addCustomer, getCustomers } from "../../../../services/customers";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustumer/NewCustomerModal/NewCustomerModal";
import { Customer } from "../../../../types/types";
import { Link } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { EditCustomerModal } from "../../../../components/Customer/EditCustumer/EditCustomerModal/EditCustomerModal";

const initialCustomers = getCustomers();

export const Customers: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState(initialCustomers);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const closeHandler = () => {
    setModalOpen(false);
  };
  const openHandler = () => {
    setModalOpen(true);
  };
  const closeEditHandler = () => {
    setEditModalOpen(false);
    setEditingCustomer(null);
  };

  const openEditHandler = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditModalOpen(true);
  };

  const submitHandler = (customer: Customer) => {
    addCustomer(customer);
    setModalOpen(false);
  };

  const editHandler = (editedCustomer: Customer) => {
    setCustomers((customers) =>
      customers.map((customer) => {
        if (customer.id === editedCustomer.id) {
          return editedCustomer;
        }
        return customer;
      })
    );
    setEditModalOpen(false);
  };

  return (
    <Wrapper>
      <IconButton>
        <Button variant="contained" onClick={openHandler}>
          <PersonAddAltIcon />
        </Button>
      </IconButton>
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
                      <IconButton>
                        <Button
                          id="edit-button"
                          variant="contained"
                          onClick={() => openEditHandler(customer)}
                        >
                          <CreateIcon />
                        </Button>
                      </IconButton>
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
      {editingCustomer && (
        <EditCustomerModal
          open={editModalOpen}
          onClose={closeEditHandler}
          onEdit={editHandler}
          customer={editingCustomer}
        />
      )}
    </Wrapper>
  );
};
