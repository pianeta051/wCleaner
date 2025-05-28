import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { JobInfo } from "../../../components/JobInfo/JobInfo";

type JobDetailsParams = {
  jobId: string;
  customerId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId, customerId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJobCustomer(customerId, jobId);

  if (!jobId) {
    return <ErrorMessage code={"INTERNAL_ERROR"} />;
  }

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Job
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return <ErrorMessage code={error} />;
  }

  if (!job) {
    return <ErrorMessage code="JOB_NOT_EXISTS" />;
  }

  return (
    <>
      <JobInfo job={job} />
    </>
  );
};
