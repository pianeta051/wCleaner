import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import Link from "@mui/material/Link";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Job, JobStatus } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { JobToggleStatusButton } from "../JobToggleStatusButton/JobToggleStatusButton";

type JobCardProps = {
  job: Job;
  onJobChanged?: () => void;
};

export const JobCard: FC<JobCardProps> = ({ job, onJobChanged }) => {
  const navigate = useNavigate();

  const resolvedCustomerId = useMemo(
    () => job.customerId ?? job.customer?.id,
    [job.customerId, job.customer?.id]
  );

  const [localStatus, setLocalStatus] = useState<JobStatus>(
    (job.status ?? "pending") as JobStatus
  );

  const jobForToggle = useMemo(
    () =>
      ({
        ...job,
        status: localStatus,
        customerId: resolvedCustomerId,
      } as Job),
    [job, localStatus, resolvedCustomerId]
  );

  const statusChangeHandler = (newStatus: JobStatus) => {
    setLocalStatus(newStatus);
    onJobChanged?.();
  };

  const phone =
    job.customer?.mainTelephone || job.customer?.secondTelephone || "";

  const canNavigateToDetails = Boolean(job.id && resolvedCustomerId);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1.5}>
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={`${job.startTime} - ${job.endTime}`} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={job.customer?.name ?? ""} />
              </ListItem>

              {phone && (
                <ListItem disablePadding>
                  <ListItemIcon>
                    <LocalPhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={phone} />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemIcon>
                  <HomeIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${job.address ?? ""} ${job.postcode ?? ""}`}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemIcon>
                  <AttachMoneyIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={`£${job.price ?? 0}`} />
              </ListItem>
            </List>

            {resolvedCustomerId ? (
              <JobToggleStatusButton
                currentJob={jobForToggle}
                onChange={statusChangeHandler}
              />
            ) : null}

            {canNavigateToDetails && (
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate(
                    `/admin/customers/${resolvedCustomerId}/jobs/${job.id}`
                  );
                }}
              >
                Read more
              </Link>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
