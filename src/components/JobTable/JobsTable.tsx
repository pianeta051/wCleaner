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
  return (
    <TableContainer component={Grid}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Price</TableCell>
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
