import { FC, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { CustomerJobModal } from "../CustomerJobModal/CustomerJobModal";
import dayjs from "dayjs";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Job } from "../../types/types";

type JobInfoDisplayProps = {
  job: Job;
  onEdit: () => void;
};

export const JobInfoDisplay: FC<JobInfoDisplayProps> = ({ job, onEdit }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const assignedTo = job?.assignedTo?.name ?? job?.assignedTo?.email;

  return (
    <>
      <Card elevation={3}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Job Details
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setModalOpen(true)}
            >
              Edit Job
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarTodayIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Date:</Typography>
                  <Typography>{new Date(job.date).toDateString()}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AccessTimeIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Start:</Typography>
                  <Typography>{job.startTime}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AccessTimeIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">End:</Typography>
                  <Typography>{job.endTime}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <HomeIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Address:</Typography>
                  <Typography>{job.address}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <MailOutlineIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Postcode:</Typography>
                  <Typography>{job.customer?.postcode}</Typography>
                </Stack>
              </Grid>

              {job.jobTypeName && (
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CategoryIcon fontSize="small" color="primary" />
                    <Typography fontWeight="bold">Job Type:</Typography>
                    <Typography>{job.jobTypeName}</Typography>
                  </Stack>
                </Grid>
              )}

              {assignedTo && (
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PersonIcon fontSize="small" color="primary" />
                    <Typography fontWeight="bold">Assigned To:</Typography>
                    <Typography>{assignedTo}</Typography>
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PointOfSaleIcon fontSize="small" color="primary" />
                  <Typography fontWeight="bold">Price:</Typography>
                  <Typography fontWeight="bold">£{job.price}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {job.customer && (
        <CustomerJobModal
          open={modalOpen}
          customer={job.customer}
          initialValues={{
            date: dayjs(job.date),
            startTime: dayjs(`${job.date} ${job.startTime}`),
            endTime: dayjs(`${job.date} ${job.endTime}`),
            price: job.price,
            jobTypeId: job.jobTypeId ?? "",
            assignedTo: job.assignedTo?.sub ?? "",
            addressId: job.addressId ?? "",
          }}
          jobId={job.id}
          onClose={() => {
            setModalOpen(false);
            onEdit();
          }}
        />
      )}
    </>
  );
};
