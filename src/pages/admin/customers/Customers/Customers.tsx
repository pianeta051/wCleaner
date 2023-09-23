import { FC, useEffect, useState } from "react";

import { Button, Paper, CircularProgress, Pagination } from "@mui/material";
import { Wrapper, Title, IconButton } from "./Customers.style";
import { getCustomers } from "../../../../services/customers";
import { Customer } from "../../../../types/types";
import AddIcon from "@mui/icons-material/Add";
import { EditCustomerModal } from "../../../../components/Customer/EditCustomer/EditCustomerModal/EditCustomerModal";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { CustomersTable } from "../../../../components/CustomersTable/CustomersTable";
import { EmptyCustomers } from "../../../../components/EmptyCustomers/EmptyCustomers";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { LoadingButton } from "@mui/lab";

export const Customers: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    if (loading) {
      getCustomers()
        .then(({ customers, nextToken }) => {
          setLoading(false);
          setCustomers(customers);
          setNextToken(nextToken);
        })
        .catch((error) => {
          setLoading(false);
          if (isErrorCode(error)) {
            setError(error);
          } else {
            setError("INTERNAL_ERROR");
          }
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

  const loadMoreHandler = () => {
    if (nextToken) {
      setLoadingMore(true);
      getCustomers(nextToken)
        .then(({ customers, nextToken }) => {
          setLoadingMore(false);
          setCustomers((prevCustomers) => [...prevCustomers, ...customers]);
          setNextToken(nextToken);
        })
        .catch(() => {
          setLoadingMore(false);
          setNextToken(undefined);
        });
    }
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
      {nextToken && (
        <LoadingButton
          variant="text"
          onClick={loadMoreHandler}
          loading={loadingMore}
        >
          Load more
        </LoadingButton>
      )}
    </Wrapper>
  );
};
