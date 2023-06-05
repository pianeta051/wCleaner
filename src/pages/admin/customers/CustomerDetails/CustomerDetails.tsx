import { Alert, CircularProgress, Grid, Snackbar } from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../../../components/Customer/CustomerForm/CustomerForm";
import { getCustomer, editCustomer } from "../../../../services/customers";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { Customer } from "../../../../types/types";
import { InternalError } from "../../../InternalError/InternalError";
import { NotFound } from "../../../NotFound/NotFound";
import { Title, Wrapper } from "./CustomerDetails.style";

type CustomerParams = {
  url: string;
};

export const CustomerDetails: FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { url } = useParams<CustomerParams>();

  useEffect(() => {
    if (loadingCustomer && url) {
      getCustomer(url).then((customer) => {
        setLoadingCustomer(false);
        setCustomer(customer);
      });
    }
  }, [loadingCustomer, setCustomer, setLoadingCustomer]);

  if (!url) {
    return <NotFound />;
  }

  const submitHandler = (formValues: CustomerFormValues) => {
    if (customer) {
      setErrorCode(null);
      setLoadingForm(true);
      editCustomer(formValues, customer.id)
        .then((customer) => {
          setLoadingForm(false);
          setCustomer(customer);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setLoadingForm(false);
          if (isErrorCode(error)) {
            setErrorCode(error);
          } else {
            setErrorCode("INTERNAL_ERROR");
          }
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
        {loadingCustomer ? (
          <CircularProgress />
        ) : customer ? (
          <CustomerForm
            onSubmit={submitHandler}
            initialValues={customer}
            loading={loadingForm}
            errorMessage={errorCode}
            layout="horizontal"
          />
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
