import { FC } from "react";
import { Job } from "../../types/types";
import {
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

type JobInfoProps = {
  job: Job;
};

export const JobInfo: FC<JobInfoProps> = ({ job }) => {
  return (
    <>
      <Typography variant="h2">Job details</Typography>
      <Stack direction="row" spacing={2}>
        <Link to={`/jobs/${job.id}/edit`}>
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
        {job?.assignedTo && (
          <ListItem disablePadding>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Assigned to"
              secondary={[job.assignedTo.name, job.assignedTo.email]
                .filter(Boolean)
                .join(" - ")}
            />
          </ListItem>
        )}
      </List>
    </>
  );
};
