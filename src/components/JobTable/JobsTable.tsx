import { FC } from "react";
import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
} from "@mui/material";
import { Customer, Job } from "../../types/types";
import { DeleteJobButton } from "../DeleteJobButton/DeleteJobButton";

type JobsTableProps = {
  jobs: Job[];
  customer: Customer;
};

export const JobsTable: FC<JobsTableProps> = ({ jobs, customer }) => {
  return (
    <TableContainer component={Grid}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs &&
            jobs.map((job) => (
              <TableRow
                key={job.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="right">{job.date}</TableCell>
                <TableCell align="right">{job.time}</TableCell>
                <TableCell align="right">{job.price}</TableCell>
                <TableCell align="right">
                  <DeleteJobButton jobId={job.id} customerId={customer.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
