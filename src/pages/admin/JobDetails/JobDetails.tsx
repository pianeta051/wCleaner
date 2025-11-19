import { FC } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Box, Grid } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useJobCustomer } from "../../../hooks/Jobs/useJobCustomer";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { JobInfoDisplay } from "../../../components/JobInfoDisplay/JobInfoDisplay";
import { JobCustomer } from "../../../components/JobCustomer/JobCustomer";
import { useAuth } from "../../../context/AuthContext";
import {
  BreadcrumbsContainer,
  StyledBreadcrumbs,
  BreadcrumbLink,
  CurrentPageText,
} from "./JobDetails.style";

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
        <BreadcrumbsContainer>
          <StyledBreadcrumbs aria-label="breadcrumb" separator="›">
            <BreadcrumbLink to="/admin/customers">
              <PeopleIcon fontSize="small" /> Customers
            </BreadcrumbLink>

            <BreadcrumbLink to={`/admin/customers/${job.customer.slug}`}>
              <HomeIcon fontSize="small" /> {job.customer.name}
            </BreadcrumbLink>

            <CurrentPageText>
              <AssignmentIcon fontSize="small" /> Job Details
            </CurrentPageText>
          </StyledBreadcrumbs>
        </BreadcrumbsContainer>
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
