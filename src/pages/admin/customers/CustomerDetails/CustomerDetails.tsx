import { Alert, CircularProgress, Grid, Snackbar } from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../../../components/Customer/CustomerForm/CustomerForm";

import { NotFound } from "../../../NotFound/NotFound";
import { Title, Wrapper } from "./CustomerDetails.style";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useCustomer } from "../../../../hooks/useCustomer";
import { useEditCustomer } from "../../../../hooks/useEditCustomer";

type CustomerParams = {
  slug: string;
};

export const CustomerDetails: FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { slug } = useParams<CustomerParams>();

  const {
    customer,
    loading: initialLoading,
    error: initialError,
  } = useCustomer(slug);
  const {
    editCustomer,
    loading: editing,
    error: editError,
  } = useEditCustomer(customer?.id, customer?.slug);

  if (!slug) {
    return <NotFound />;
  }

  const submitHandler = (formValues: CustomerFormValues) => {
    if (customer) {
      editCustomer(formValues)
        .then(() => {
          setSnackbarOpen(true);
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
    }
  };

  const closeHandler = () => {
    setSnackbarOpen(false);
  };

  return (
    <Wrapper>
      <Title variant="h3" align="center">
        Customer details
      </Title>

      <Grid container spacing={0} direction="column" alignItems="center">
        {initialLoading ? (
          <CircularProgress />
        ) : initialError ? (
          <ErrorMessage code={initialError} />
        ) : customer ? (
          <>
            {editError && <ErrorMessage code={editError} />}
            <CustomerForm
              onSubmit={submitHandler}
              initialValues={customer}
              loading={editing}
              layout="horizontal"
            />
          </>
        ) : (
          <NotFound data-testid="not-found-message" />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={closeHandler}
        >
          <Alert
            onClose={closeHandler}
            severity="success"
            sx={{ width: "100%" }}
          >
            Customer updated!
          </Alert>
        </Snackbar>
      </Grid>
    </Wrapper>
  );
};
