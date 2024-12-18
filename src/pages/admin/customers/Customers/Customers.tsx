import { FC, useState } from "react";

import { Button, CircularProgress } from "@mui/material";
import { Wrapper, Title, IconButton } from "./Customers.style";

import AddIcon from "@mui/icons-material/Add";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { CustomersTable } from "../../../../components/CustomersTable/CustomersTable";
import { EmptyCustomers } from "../../../../components/EmptyCustomers/EmptyCustomers";

import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../../../components/SearchBar/SearchBar";

import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useCustomers } from "../../../../hooks/Customers/useCustomers";

export const Customers: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const { customers, error, loading, loadMore, moreToLoad, loadingMore } =
    useCustomers(searchInput);

  const closeHandler = () => {
    setModalOpen(false);
  };
  const openHandler = () => {
    setModalOpen(true);
  };

  const searchHandler = (searchInput: string) => {
    setSearchInput(searchInput);
  };

  const isEmpty = customers.length === 0 && !loading && searchInput === "";

  return (
    <Wrapper>
      {isEmpty ? (
        <EmptyCustomers onCreateNew={openHandler} />
      ) : (
        <>
          <IconButton>
            <Button startIcon={<AddIcon />} onClick={openHandler}>
              New customer
            </Button>
          </IconButton>
          <Title>Customers</Title>
          <SearchBar onSearch={searchHandler} initialValue={searchInput} />
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <ErrorMessage code={error} />
          ) : (
            <>
              <CustomersTable customers={customers} />
              {moreToLoad && (
                <LoadingButton
                  variant="text"
                  onClick={loadMore}
                  loading={loadingMore}
                >
                  Load more
                </LoadingButton>
              )}
            </>
          )}
        </>
      )}
      <NewCustomerModal
        open={modalOpen}
        onClose={closeHandler}
        onSubmit={closeHandler}
      />
    </Wrapper>
  );
};
