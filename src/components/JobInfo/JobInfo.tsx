import { FC } from "react";
import { CircularProgress } from "@mui/material";
import { Job } from "../../types/types";
import { useCustomerById } from "../../hooks/Customers/useCustomerById";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { JobInfoDisplay } from "../JobInfoDisplay/JobInfoDisplay";

type JobInfoProps = {
  job: Job;
  customerId: string;
};

export const JobInfo: FC<JobInfoProps> = ({ job, customerId }) => {
  const { customer, loading, error } = useCustomerById(customerId);

  if (loading) return <CircularProgress />;
  if (error || !customer)
    return <ErrorMessage code={error || "CUSTOMER_NOT_FOUND"} />;

  return <JobInfoDisplay job={job} customer={customer} />;
};
