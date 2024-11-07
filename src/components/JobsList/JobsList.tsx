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
  const jobText = (job: Job): string | React.ReactNode => {
    const dateAndTime = `${job.date} ${job.startTime} - ${job.endTime}`;
    if (job.assignedTo) {
      const assignedTo = [job.assignedTo.name, job.assignedTo.email]
        .filter(Boolean)
        .join(" - ");
      return (
        <>
          {assignedTo}
          <br />
          {dateAndTime}
        </>
      );
    }
    return dateAndTime;
  };
  return (
    <List>
      {jobs.map((job) => (
        <ListItemButton
          onClick={() => navigate(`/jobs/${job.id}`)}
          key={job.id}
        >
          <ListItemText secondary={jobText(job)} />
        </ListItemButton>
      ))}
    </List>
  );
};
