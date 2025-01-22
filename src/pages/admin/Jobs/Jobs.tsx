import {
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";

export const JobsPage: FC = () => {
  const [view, setView] = useState("users");
  const changeViewHandler: (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => void = (_event, view) => {
    setView(view);
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <Grid container justifyContent="flex-end">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={changeViewHandler}
          aria-label="text alignment"
        >
          <ToggleButton value="jobTypes">Job Types</ToggleButton>
          <ToggleButton value="users">Users</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <JobCalendars />
    </>
  );
};
