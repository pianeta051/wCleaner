import { FC } from "react";
import { Job } from "../../types/types";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { CustomerFiles } from "../CustomerFiles/CustomerFiles";
import { CustomerNotes } from "../CustomerNotes/CustomerNotes";
import { useAuth } from "../../context/AuthContext";
import { useJobCustomer } from "../../hooks/Jobs/useJobCustomer";

type JobCustomerProps = {
  job: Job;
};

export const JobCustomer: FC<JobCustomerProps> = ({ job }) => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const { reload } = useJobCustomer(job.customer?.id, job.id);

  if (!job.customer) {
    return null;
  }
  return (
    <Grid container spacing={3} mt={3}>
      <Grid item xs={12}>
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
                Customer Details
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontWeight="bold">Name:</Typography>
                  <Typography>{job.customer.name}</Typography>
                </Stack>
              </Grid>

              {isAdmin && job.customer.email && (
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontWeight="bold">Email:</Typography>
                    <Typography>{job.customer.email}</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              {isAdmin && job.customer.mainTelephone && (
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontWeight="bold">Telephone:</Typography>
                    <Typography>{job.customer.mainTelephone}</Typography>
                  </Stack>
                </Grid>
              )}
              {isAdmin && job.customer.secondTelephone && (
                <Grid item xs={6} sm={3}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography fontWeight="bold">Second Telephone:</Typography>
                    <Typography>{job.customer.secondTelephone}</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomerFiles customer={job.customer} jobId={job.id} />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomerNotes customer={job.customer} jobId={job.id} />
      </Grid>
    </Grid>
  );
};
