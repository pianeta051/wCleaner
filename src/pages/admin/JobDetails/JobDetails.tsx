import { CircularProgress, Typography, Box, Grid } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { JobInfoDisplay } from "../../../components/JobInfoDisplay/JobInfoDisplay";
import { JobCustomer } from "../../../components/JobCustomer/JobCustomer";

type JobDetailsParams = {
  jobId: string;
  customerId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId, customerId } = useParams<JobDetailsParams>();

  if (!jobId || !customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const { job, loading, error, reload } = useJobCustomer(customerId, jobId);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h3" gutterBottom>
          <CircularProgress />
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage code={error} />;
  }

  if (!job) {
    return <ErrorMessage code="JOB_NOT_EXISTS" />;
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <JobInfoDisplay job={job} onEdit={reload} />
      </Grid>
      {job.customer && (
        <Grid item xs={12} md={10} lg={8}>
          <JobCustomer job={job} />
        </Grid>
      )}
    </Grid>
  );
};
