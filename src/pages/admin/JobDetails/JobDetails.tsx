import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";

import { ErrorCode } from "../../../services/error";

type JobDetailsParams = {
  jobId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJobCustomer(jobId);
  const [operationError, setOperationError] = useState<ErrorCode | null>(null);

  // if (!jobId) {
  //   return <ErrorMessage code={"INTERNAL_ERROR"} />;
  // }

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

  // if (error) {
  //   return <ErrorMessage code={error} />;
  // }

  // if (!job) {
  //   return <ErrorMessage code="JOB_NOT_EXISTS" />;
  // }

  return (
    <>
      {operationError}
      <Stack direction="row" spacing={2}>
        <Link to={`/jobs/${jobId}/edit`}>
          <Button variant="contained">Edit</Button>
        </Link>
      </Stack>
      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Date" secondary={job?.date} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary="Start time" secondary={job?.startTime} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary="End time" secondary={job?.endTime} />
        </ListItem>
      </List>
    </>
  );
};
