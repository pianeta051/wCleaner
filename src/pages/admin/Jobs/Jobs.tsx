import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";

export const JobsPage: FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <Grid container justifyContent="flex-end">
        <Button variant="text">Categories</Button>
        <Button variant="text">Users</Button>
      </Grid>

      <JobCalendars />
    </>
  );
};
