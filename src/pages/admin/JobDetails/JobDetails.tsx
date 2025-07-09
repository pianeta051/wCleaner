import { FC } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";

import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { JobInfoDisplay } from "../../../components/JobInfoDisplay/JobInfoDisplay";
import { JobCustomer } from "../../../components/JobCustomer/JobCustomer";
import { useAuth } from "../../../context/AuthContext";

type JobDetailsParams = {
  jobId: string;
  customerId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId, customerId } = useParams<JobDetailsParams>();
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  if (!jobId || !customerId) return <ErrorMessage code="INTERNAL_ERROR" />;

  const { job, loading, error, reload } = useJobCustomer(customerId, jobId);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error) return <ErrorMessage code={error} />;
  if (!job) return <ErrorMessage code="JOB_NOT_EXISTS" />;

  return (
    <>
      {isAdmin && job.customer && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={RouterLink} to="/admin/customers">
            Customers
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to={`/admin/customers/${job.customer.slug}`}
          >
            {job.customer.name}
          </MuiLink>
          <Typography color="text.primary">Job Details</Typography>
        </Breadcrumbs>
      )}

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <JobInfoDisplay job={job} onEdit={reload} />
        </Grid>

        {job.customer && (
          <Grid item xs={12} md={10} lg={8}>
            <JobCustomer job={job} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
