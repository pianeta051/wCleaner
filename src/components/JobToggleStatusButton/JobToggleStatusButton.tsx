import { FC } from "react";
import { Job, JobStatus } from "../../types/types";

import { Button } from "@mui/material";
import { useUpdateJobStatus } from "../../hooks/Jobs/useUpdateJobStatus";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
type JobToggleStatusButtonProps = {
  currentJob: Job;
  onChange: (status: JobStatus) => void;
};

export const JobToggleStatusButton: FC<JobToggleStatusButtonProps> = ({
  currentJob,
  onChange,
}) => {
  const { updateStatus, error, loading } = useUpdateJobStatus(
    currentJob.customerId,
    currentJob.id
  );

  const clickHandler = () => {
    const newStatus: JobStatus =
      currentJob.status === "pending" ? "completed" : "pending";
    updateStatus(newStatus)
      .then(() => onChange(newStatus))
      .catch(() => {
        // the hook manages the error
      });
  };
  if (currentJob.status === "cancelled" || !currentJob.status) {
    return null;
  }
  const text =
    currentJob.status === "pending" ? "Mark as completed" : "Mark as pending";

  return (
    <>
      <Button onClick={clickHandler} loading={loading}>
        {text}
      </Button>
      {error && <ErrorMessage code={error} />}
    </>
  );
};
