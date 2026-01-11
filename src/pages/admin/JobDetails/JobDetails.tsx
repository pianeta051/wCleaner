import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Grid,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTheme } from "@mui/material/styles";

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

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const stickyTop = useMemo(() => {
    const mh = theme.mixins.toolbar.minHeight;
    const appBarHeight = typeof mh === "number" ? mh : isMdUp ? 64 : 56;
    return appBarHeight;
  }, [theme, isMdUp]);

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
      <Toolbar />

      {isAdmin && job.customer && (
        <BreadcrumbsContainer $top={stickyTop}>
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
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "80%" },
          mx: "auto",
        }}
      >
        <Grid container spacing={{ xs: 2 }} sx={{ px: { xs: 1.5, md: 0 } }}>
          <Grid item xs={12}>
            <JobInfoDisplay job={job} onEdit={reload} />
          </Grid>

          {job.customer && (
            <Grid item xs={12}>
              <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
                <JobCustomer job={job} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
