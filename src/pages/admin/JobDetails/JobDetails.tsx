import { CircularProgress, Typography, Box } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { JobInfo } from "../../../components/JobInfo/JobInfo";
import LoadingButton from "@mui/lab/LoadingButton";

type JobDetailsParams = {
  jobId: string;
  customerId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId, customerId } = useParams<JobDetailsParams>();

  if (!jobId || !customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const { job, loading, error } = useJobCustomer(customerId, jobId);

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

  return <JobInfo job={job} customerId={customerId} />;
};
