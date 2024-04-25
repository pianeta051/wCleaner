import { Alert, CircularProgress, Grid, Snackbar } from "@mui/material";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import {
  JobForm,
  JobFormValues,
} from "../../../../components/Jobs/JobForm/JobForm";

import { NotFound } from "../../../NotFound/NotFound";
import { Title, Wrapper } from "./JobDetails.style";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useJob } from "../../../../hooks/Jobs/useJob";
import { useEditJob } from "../../../../hooks/Jobs/useEditJob";
import { Customer } from "../../../../types/types";
import dayjs from "dayjs";

type JobParams = {
  id: string;
};
type JodDetailsProps = {
  customer: Customer;
};
export const JobDetails: FC<JodDetailsProps> = ({ customer }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { id } = useParams<JobParams>();

  const { job, loading: initialLoading, error: initialError } = useJob(id);
  const {
    editCustomerJob,
    loading: editing,
    error: editError,
  } = useEditJob(job?.id, job?.id);

  if (!id) {
    return <NotFound />;
  }

  const submitHandler = (formValues: JobFormValues) => {
    if (job) {
      editCustomerJob(formValues)
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
        Job details
      </Title>

      <Grid container spacing={0} direction="column" alignItems="center">
        {initialLoading ? (
          <CircularProgress />
        ) : initialError ? (
          <ErrorMessage code={initialError} />
        ) : job ? (
          <>
            {editError && <ErrorMessage code={editError} />}
            <JobForm
              onSubmit={submitHandler}
              initialValues={{ ...job, date: dayjs(job.date) }}
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
            Job updated!
          </Alert>
        </Snackbar>
      </Grid>
    </Wrapper>
  );
};
