import { Alert, Button } from "@mui/material";
import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import { GridNoJob } from "./EmptyJobs.style";

type EmptyJobsProps = {
  onCreateNew: () => void;
};

export const EmptyJobs: FC<EmptyJobsProps> = ({ onCreateNew }) => {
  return (
    <>
      <Alert severity="warning">No jobs found</Alert>

      <GridNoJob>Create your first job in the following button</GridNoJob>

      <Button
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        variant="contained"
        size="large"
        sx={{ marginBottom: 2 }}
      >
        Create your first Job
      </Button>
    </>
  );
};
