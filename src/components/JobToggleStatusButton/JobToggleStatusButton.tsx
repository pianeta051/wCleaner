import { FC } from "react";
import { Job, JobStatus } from "../../types/types";

import { LoadingButton } from "@mui/lab";
import { useUpdateJobStatus } from "../../hooks/Jobs/useUpdateJobStatus";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { CognitoUserWithAttributes } from "../../services/authentication";
import { useCustomerEditJob } from "../../hooks/Jobs/useEditJob";
import { transformToFormValues } from "../../helpers/job";
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
      <LoadingButton onClick={clickHandler} loading={loading}>
        {text}
      </LoadingButton>
      {error && <ErrorMessage code={error} />}
    </>
  );
};
