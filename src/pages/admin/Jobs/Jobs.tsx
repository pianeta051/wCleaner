import { Typography } from "@mui/material";
import { FC } from "react";
import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";

export const JobsPage: FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <JobCalendars />
    </>
  );
};
