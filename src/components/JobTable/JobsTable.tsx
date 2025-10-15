import {
  Button,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { DeleteJobButton } from "../DeleteJobButton/DeleteJobButton";
import { useAuth } from "../../context/AuthContext";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";
import { Customer, Job } from "../../types/types";

type Props = {
  jobs: Job[];
  customer: Customer;
  jobIdSelected?: string | null;
  onEditClick: (jobId: string) => void;
};

export const JobsTable: FC<Props> = ({
  jobs,
  customer,
  jobIdSelected,
  onEditClick,
}) => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const jobTypeGetter = useJobTypeGetter();

  const assignedToText = (job: Job): React.ReactNode => {
    if (!job.assignedTo) return "Not assigned";
    const { name, email } = job.assignedTo;
    return [name, email].filter(Boolean).join(" - ");
  };

  return (
    <TableContainer component={Grid}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Price</TableCell>
            {isAdmin && <TableCell align="right">Assigned to</TableCell>}
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              hover
              sx={
                jobIdSelected === job.id
                  ? { backgroundColor: "#e3f2fd" }
                  : undefined
              }
            >
              {/* clickable link to job details */}
              <TableCell align="right">
                <Link
                  component={RouterLink}
                  to={`/admin/customers/${customer.id}/jobs/${job.id}`}
                  underline="hover"
                >
                  {dayjs(job.date).format("ddd MMM D, YYYY")}
                </Link>
              </TableCell>

              <TableCell align="right">{job.startTime}</TableCell>
              <TableCell align="right">{job.endTime}</TableCell>
              <TableCell align="right">{job.address}</TableCell>
              <TableCell align="right">{job.price}</TableCell>

              {isAdmin && (
                <TableCell align="right">{assignedToText(job)}</TableCell>
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
                <Button variant="contained" onClick={() => onEditClick(job.id)}>
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
