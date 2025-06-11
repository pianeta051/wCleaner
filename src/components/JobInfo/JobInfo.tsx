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

export const JobInfo: FC<JobInfoProps> = ({ job }) => {
  return <JobInfoDisplay job={job} />;
};
