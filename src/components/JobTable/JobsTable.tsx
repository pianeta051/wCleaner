import { FC } from "react";
import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Customer, Job } from "../../types/types";
import { DeleteJobButton } from "../DeleteJobButton/DeleteJobButton";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";

type JobsTableProps = {
  jobs: Job[];
  jobIdSelected?: string | null;
  customer: Customer;
  onEditClick: (jobId: string) => void;
};

export const JobsTable: FC<JobsTableProps> = ({
  jobs,
  jobIdSelected,
  customer,
  onEditClick,
}) => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const jobTypeGetter = useJobTypeGetter();
  const jobText = (job: Job): string | React.ReactNode => {
    if (job.assignedTo) {
      const assignedTo = [job.assignedTo.name, job.assignedTo.email]
        .filter(Boolean)
        .join(" - ");
      return (
        <>
          {assignedTo}
          <br />
        </>
      );
    }
  };

  return (
    <TableContainer component={Grid}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Price</TableCell>
            {isAdmin && <TableCell align="right">Assigned to</TableCell>}
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs &&
            jobs.map((job) => (
              <TableRow
                style={
                  job.id === jobIdSelected
                    ? {
                        backgroundColor: "#e3f2fd",
                      }
                    : {}
                }
                hover={true}
                key={job.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell align="right">
                  {dayjs(job.date).format("ddd MMM D, YYYY")}
                </TableCell>
                <TableCell align="right">{job.startTime}</TableCell>
                <TableCell align="right">{job.endTime}</TableCell>
                <TableCell align="right">{job.price}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    {jobText(job) ?? "Not assigned"}
                  </TableCell>
                )}
                <TableCell align="right">
                  {job.jobTypeId
                    ? jobTypeGetter(job.jobTypeId)?.name ?? "None"
                    : "None"}
                </TableCell>
                <TableCell align="right">
                  <DeleteJobButton jobId={job.id} customerId={customer.id} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => onEditClick(job.id)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
