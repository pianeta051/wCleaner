import { FC } from "react";

import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { UserColor } from "../UserColor/UserColor";
import { Job } from "../../types/types";
import { Padding } from "@mui/icons-material";

type JobCalendarColorLegendProps = {
  jobs: Job[];
  mode?: "users" | "jobTypes";
};

export const JobCalendarColorLegend: FC<JobCalendarColorLegendProps> = ({
  jobs,
  mode = "users",
}) => {
  const usersWithColors = jobs
    .filter((job) => !!job.assignedTo?.color)
    .map((job) => job.assignedTo)
    // remove duplicate users
    .filter(
      (user, index, self) =>
        index === self.findIndex((t) => t?.sub === user?.sub)
    );
  if (usersWithColors.length === 0) {
    return null;
  }

  return (
    <>
      <Typography gutterBottom variant="h5" component="div">
        Color legend
      </Typography>

      <List
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {usersWithColors.map((user) => (
          <ListItem alignItems="flex-start" disablePadding key={user?.sub}>
            <ListItemIcon>
              <UserColor color={user?.color as string} />
            </ListItemIcon>
            <ListItemText primary={user?.name ?? user?.email} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
