import { FC, useState } from "react";

import { Button, Paper } from "@mui/material";
import {
  Wrapper,
  Title,
  New,
  TableHead,
  TableData,
  TableBody,
} from "./Customers.style";
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
        <div>
          {customers.length === 0 && (
            <div className="text-center">
              <h2>No customer found at the moment</h2>
            </div>
          )}
          <div className="container">
            <div className="row">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Additinal phone</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>Actions</TableHead>
                  </tr>
                </thead>
                <TableBody>
                  {customers &&
                    customers.map((customer) => (
                      <tr key={customer.url}>
                        <TableData>
                          <Link to={customer.url}>{customer.name}</Link>
                        </TableData>
                        <TableData>{customer.address}</TableData>
                        <TableData>{customer.postcode}</TableData>
                        <TableData>{customer.mainTelephone}</TableData>
                        <TableData>{customer.secondTelephone}</TableData>
                        <TableData>{customer.email}</TableData>
                        <TableData>
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className="btn-group"
                              style={{ marginBottom: "20px" }}
                            >
                              <Link
                                to={`edit/${customer.url}`}
                                className="btn btn-sm btn-outline-secondary"
                              >
                                <CreateIcon />{" "}
                              </Link>
                            </div>
                          </div>
                        </TableData>
                      </tr>
                    ))}
                </TableBody>
              </table>
            </div>
          </div>
        </div>
      </Paper>
      <NewCustomerModal
        open={modalOpen}
        onClose={closeHandler}
        onSubmit={submitHandler}
      />
    </Wrapper>
  );
};
