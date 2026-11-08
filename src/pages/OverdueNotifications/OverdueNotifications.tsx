import { FC, useState } from "react";
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import { useOverdueJobs } from "../../hooks/Jobs/useOverdueJobs";

export const OverdueNotifications: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();

  const {
    jobs: overdueJobs,
    total: overdueTotal,
    loading: overdueLoading,
  } = useOverdueJobs();

  const closeNotifications = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Overdue jobs">
        <IconButton
          color="inherit"
          aria-label="overdue jobs"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge badgeContent={overdueTotal} color="error" max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeNotifications}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: { xs: 300, sm: 380 }, maxWidth: "90vw" }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Overdue Jobs ({overdueTotal})
            </Typography>
          </Box>

          <Divider />

          {overdueLoading ? (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : overdueJobs.length === 0 ? (
            <Typography sx={{ p: 3 }} color="text.secondary">
              No overdue jobs.
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflowY: "auto", p: 0 }}>
              {overdueJobs.map((job) => (
                <ListItemButton
                  key={job.id}
                  onClick={() => {
                    closeNotifications();
                    navigate(
                      `/admin/customers/${job.customer?.slug}/jobs/${job.id}`
                    );
                  }}
                  divider
                >
                  <ListItemText
                    primary={job.customer?.name ?? "Unknown customer"}
                    secondary={`${job.date} · ${job.startTime} · Overdue`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};
