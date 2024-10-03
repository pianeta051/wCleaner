import { Alert, List, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Job } from "../../types/types";

type JobsListProps = { jobs: Job[] };

export const JobsList: FC<JobsListProps> = ({ jobs }) => {
  const navigate = useNavigate();
  if (jobs.length === 0) {
    return <Alert severity="warning">There are no jobs</Alert>;
  }
  return (
    <List>
      {jobs.map((job) => (
        <ListItemButton
          onClick={() => navigate(`/jobs/${job.id}`)}
          key={job.id}
        >
          <ListItemText
            secondary={`${job.date} ${job.startTime} - ${job.endTime}`}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
