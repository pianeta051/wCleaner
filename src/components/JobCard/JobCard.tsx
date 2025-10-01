import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC } from "react";
import Link from "@mui/material/Link";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Job } from "../../types/types";
import { useNavigate } from "react-router-dom";

type JobCardProps = { job: Job };

export const JobCard: FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <List>
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
              <ListItemText primary={`${job.customer?.name}`} />
            </ListItem>
            {(job.customer?.mainTelephone || job.customer?.secondTelephone) && (
              <ListItem disablePadding>
                <ListItemIcon>
                  <LocalPhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${
                    job.customer?.mainTelephone
                      ? job.customer?.mainTelephone
                      : job.customer?.secondTelephone
                  }`}
                />
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemIcon>
                <HomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={`${job?.address}  ${job?.postcode}`} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AttachMoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={`£${job.price}`} />
            </ListItem>
          </List>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              navigate(`/admin/customers/${job.customer?.id}/jobs/${job.id}`);
            }}
          >
            Read more
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
};
