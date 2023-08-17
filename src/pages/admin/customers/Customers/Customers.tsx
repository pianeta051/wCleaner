import { FC, useEffect, useState } from "react";

import { Button, Paper, CircularProgress } from "@mui/material";
import { Wrapper, Title, IconButton } from "./Customers.style";
import { getCustomers } from "../../../../services/customers";
import { Customer } from "../../../../types/types";
import AddIcon from "@mui/icons-material/Add";
import { EditCustomerModal } from "../../../../components/Customer/EditCustomer/EditCustomerModal/EditCustomerModal";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { CustomersTable } from "../../../../components/CustomersTable/CustomersTable";
import { EmptyCustomers } from "../../../../components/EmptyCustomers/EmptyCustomers";

export const Customers: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      getCustomers().then((customers) => {
        setLoading(false);
        setCustomers(customers);
      });
    }
  }, [loading, setCustomers, setLoading]);

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

  const addHandler = (customer: Customer) => {
    setCustomers((customers) => [...customers, customer]);
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

  const deleteHandler = () => {
    if (editingCustomer) {
      setCustomers((customers) =>
        customers.filter((customer) => customer.id !== editingCustomer.id)
      );
      closeEditHandler();
    }
  };

  return (
    <Wrapper>
      <Paper elevation={13}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {customers.length === 0 ? (
              <EmptyCustomers onCreateNew={openHandler} />
            ) : (
              <>
                <IconButton>
                  <Button startIcon={<AddIcon />} onClick={openHandler}>
                    New customer
                  </Button>
                </IconButton>
                <Title>Customers</Title>
                <CustomersTable
                  customers={customers}
                  onEdit={openEditHandler}
                />
              </>
            )}
          </>
        )}
      </Paper>
      <NewCustomerModal
        open={modalOpen}
        onClose={closeHandler}
        onSubmit={addHandler}
      />
      {editingCustomer && (
        <EditCustomerModal
          open={editModalOpen}
          onClose={closeEditHandler}
          onEdit={editHandler}
          customer={editingCustomer}
          onDelete={deleteHandler}
        />
      )}
    </Wrapper>
  );
};
