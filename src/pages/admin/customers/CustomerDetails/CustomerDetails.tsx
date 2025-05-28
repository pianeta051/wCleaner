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
import { deleteFile } from "../../../../services/files";
import { CustomerFiles } from "../../../../components/CustomerFiles/CustomerFiles";
import { CustomerNotes } from "../../../../components/CustomerNotes/CustomerNotes";

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

  const submitHandler = (formValues: CustomerFormValues) => {
    if (customer) {
      editCustomer(formValues)
        .then(() => setSnackbarOpen(true))
        .catch((error) => {
          throw error;
        });
    }
  };

  const closeHandler = () => {
    setSnackbarOpen(false);
  };
  const editCustomerHandler = async (
    updatedFields: Partial<CustomerFormValues>
  ) => {
    if (!customer) return;

    await editCustomer({
      ...customer,
      ...updatedFields,
    });

    setSnackbarOpen(true);
  };

  if (!slug) {
    return <NotFound />;
  }

  const deleteFileHandler = async (index: number) => {
    if (!customer || !customer.fileUrls) return;

    const fileKeyToDelete = customer.fileUrls[index];
    const newFileKeys = customer.fileUrls.filter((_, i) => i !== index);

    try {
      // Delete from S3
      await deleteFile(fileKeyToDelete);

      // Update customer record
      await editCustomerHandler({ fileUrls: newFileKeys });

      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
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
                  initialValues={customer}
                  loading={editing}
                  layout="horizontal"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomerNotes customer={customer} />
              </Grid>
            </Grid>
            <DividerLine />
            <Grid item xs={12} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <CustomerJobs customer={customer} />
                </Grid>
                <CustomerFiles
                  customer={customer}
                  onEditUrls={(urls) => editCustomerHandler({ fileUrls: urls })}
                  onDeleteFile={deleteFileHandler}
                />
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
