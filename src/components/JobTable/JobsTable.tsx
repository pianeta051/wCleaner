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
  useMediaQuery,
  Stack,
  CardContent,
  Typography,
  Divider,
  Chip,
  CardActions,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import dayjs from "dayjs";
import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

import { DeleteJobButton } from "../DeleteJobButton/DeleteJobButton";
import { useAuth } from "../../context/AuthContext";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";
import { Customer, Job } from "../../types/types";
import { theme } from "../../theme";
import {
  CardActionsSx,
  JobCard,
  JobCardLink,
  LinkStyle,
  TableCellWrap,
} from "./JobTable.style";

type Props = {
  jobs: Job[];
  customer: Customer;
  jobIdSelected?: string | null;
  onEditClick: (jobId: string) => void;
  onDelete: () => void;
};

export const JobsTable: FC<Props> = ({
  jobs,
  customer,
  jobIdSelected,
  onEditClick,
  onDelete,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const jobTypeGetter = useJobTypeGetter();

  const assignedToText = (job: Job): React.ReactNode => {
    if (!job.assignedTo) return "Not assigned";
    const { name, email } = job.assignedTo;
    return name ? name : email;
  };

  const jobTypeName = (job: Job) =>
    job.jobTypeId ? jobTypeGetter(job.jobTypeId)?.name ?? "None" : "None";

  const jobUrl = (jobId: string) =>
    `/admin/customers/${customer.id}/jobs/${jobId}`;

  const formatPrice = (price?: number | string | null) => {
    if (price === null || price === undefined || price === "") return "—";
    return `£${price}`;
  };

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {jobs.map((job) => {
          const selected = jobIdSelected === job.id;

          return (
            <JobCard key={job.id} variant="outlined" $selected={selected}>
              <JobCardLink to={jobUrl(job.id)} style={LinkStyle}>
                <CardContent sx={{ pb: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Typography variant="h6" fontWeight={900} noWrap>
                      {dayjs(job.date).format("ddd MMM D, YYYY")}
                    </Typography>

                    <Chip
                      size="small"
                      variant="outlined"
                      label={jobTypeName(job)}
                    />
                  </Stack>

                  <Stack direction="row" gap={1.25} sx={{ mt: 1.5 }}>
                    <AccessTimeOutlinedIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Start:</strong> {job.startTime || "—"}{" "}
                      <Box component="span" sx={{ mx: 1 }}>
                        •
                      </Box>
                      <strong>End:</strong> {job.endTime || "—"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" gap={1.25} sx={{ mt: 1 }}>
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {job.address || "—"} {job.postcode || ""}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {formatPrice(job.price)}
                      </Typography>
                    </Stack>

                    {isAdmin && (
                      <Stack direction="row" gap={1.25} alignItems="flex-start">
                        <PersonOutlineOutlinedIcon fontSize="small" />
                        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            Assigned to
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ wordBreak: "break-word" }}
                          >
                            {assignedToText(job)}
                          </Typography>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </JobCardLink>

              <CardActions {...CardActionsSx}>
                <Button
                  component={RouterLink}
                  to={jobUrl(job.id)}
                  variant="contained"
                  size="small"
                >
                  Open
                </Button>

                <Stack direction="row" gap={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => onEditClick(job.id)}
                    aria-label="edit job"
                  >
                    <EditIcon />
                  </IconButton>

                  <DeleteJobButton
                    jobId={job.id}
                    customerId={customer.id}
                    onDelete={onDelete}
                  />
                </Stack>
              </CardActions>
            </JobCard>
          );
        })}
      </Stack>
    );
  }

  return (
    <TableContainer component={Grid}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {[
              "Date",
              "Start Time",
              "End Time",
              "Address",
              "Price",
              ...(isAdmin ? ["Assigned to"] : []),
              "Type",
              "Actions",
            ].map((header) => (
              <TableCellWrap
                key={header}
                align={header === "Date" ? "left" : "right"}
              >
                {header}
              </TableCellWrap>
            ))}
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
              <TableCell align="left">
                <Link
                  component={RouterLink}
                  to={jobUrl(job.id)}
                  underline="hover"
                  style={LinkStyle}
                >
                  {dayjs(job.date).format("ddd MMM D, YYYY")}
                </Link>
              </TableCell>

              <TableCell align="right">{job.startTime}</TableCell>
              <TableCell align="right">{job.endTime}</TableCell>
              <TableCell align="right">
                {job.address} {job.postcode}
              </TableCell>
              <TableCell align="right">{job.price}</TableCell>

              {isAdmin && (
                <TableCell align="right">{assignedToText(job)}</TableCell>
              )}

              <TableCell align="right">{jobTypeName(job)}</TableCell>

              <TableCell align="right">
                <Stack direction="row" justifyContent="flex-end" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => onEditClick(job.id)}
                    aria-label="edit job"
                  >
                    <EditIcon />
                  </IconButton>

                  <DeleteJobButton
                    jobId={job.id}
                    customerId={customer.id}
                    onDelete={onDelete}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
