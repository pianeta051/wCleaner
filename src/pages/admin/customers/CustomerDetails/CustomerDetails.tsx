import { Alert, CircularProgress, Grid, Snackbar } from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../../../components/Customer/CustomerForm/CustomerForm";
import { NotFound } from "../../../NotFound/NotFound";
import { DividerLine, Title, Wrapper } from "./CustomerDetails.style";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useCustomer } from "../../../../hooks/Customers/useCustomer";
import { useEditCustomer } from "../../../../hooks/Customers/useEditCustomer";
import { CustomerJobs } from "../../../../components/CustomerJobs/CustomerJobs";
import { CustomerFiles } from "../../../../components/CustomerFiles/CustomerFiles";
import { CustomerNotes } from "../../../../components/CustomerNotes/CustomerNotes";
import { customerToFormValues } from "../../../../helpers/customer";

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
    reload: reloadCustomer,
  } = useCustomer(slug);

  const {
    editCustomer,
    loading: editing,
    error: editError,
  } = useEditCustomer(customer?.id, customer?.slug);

  const submitHandler = async (formValues: CustomerFormValues) => {
    if (!customer) return;

    try {
      await editCustomer(formValues);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const closeHandler = () => setSnackbarOpen(false);

  if (!slug) return <NotFound />;

  return (
    <Wrapper>
      <Grid container spacing={0} direction="column" alignItems="center">
        {initialLoading ? (
          <CircularProgress />
        ) : initialError ? (
          <ErrorMessage code={initialError} />
        ) : customer ? (
          <>
            {editError && <ErrorMessage code={editError} />}

            <Title variant="h3" align="center">
              Customer details
            </Title>

            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <CustomerForm
                  onSubmit={submitHandler}
                  initialValues={customerToFormValues(customer)}
                  loading={editing}
                  layout="horizontal"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomerNotes customer={customer} />
              </Grid>
            </Grid>

            <DividerLine />

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <CustomerJobs customer={customer} />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomerFiles customer={customer} />
              </Grid>
            </Grid>
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
