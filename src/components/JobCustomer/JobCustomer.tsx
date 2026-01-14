import { FC } from "react";
import { Job } from "../../types/types";
import {
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { CustomerFiles } from "../CustomerFiles/CustomerFiles";
import { CustomerNotes } from "../CustomerNotes/CustomerNotes";
import { useAuth } from "../../context/AuthContext";
import {
  CardHeaderRow,
  CardTitle,
  Section,
  SectionCard,
} from "./JobCustomer.style";

type JobCustomerProps = {
  job: Job;
};

export const JobCustomer: FC<JobCustomerProps> = ({ job }) => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  if (!job.customer) return null;

  return (
    <Section>
      <SectionCard>
        <CardContent>
          <CardHeaderRow>
            <CardTitle variant="h5">Customer Details</CardTitle>
          </CardHeaderRow>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={12}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography fontWeight={800}>Name:</Typography>
                <Typography sx={{ wordBreak: "break-word" }}>
                  {job.customer.name}
                </Typography>
              </Stack>
            </Grid>

            {isAdmin && job.customer.email && (
              <Grid size={12}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontWeight={800}>Email:</Typography>
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {job.customer.email}
                  </Typography>
                </Stack>
              </Grid>
            )}

            {isAdmin && job.customer.mainTelephone && (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontWeight={800}>Telephone:</Typography>
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {job.customer.mainTelephone}
                  </Typography>
                </Stack>
              </Grid>
            )}

            {isAdmin && job.customer.secondTelephone && (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography fontWeight={800}>Second Telephone:</Typography>
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {job.customer.secondTelephone}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </SectionCard>
      <SectionCard>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <CardTitle variant="h6">Notes</CardTitle>
            <Typography variant="body2" color="text.secondary">
              Add notes and keep track of updates.
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <CustomerNotes customer={job.customer} jobId={job.id} />
        </CardContent>
      </SectionCard>
      <SectionCard>
        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <CustomerFiles customer={job.customer} jobId={job.id} />
        </CardContent>
      </SectionCard>
    </Section>
  );
};
