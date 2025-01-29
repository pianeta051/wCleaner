import { FC } from "react";

import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { UserColor } from "../UserColor/UserColor";
import { Job } from "../../types/types";
import { Padding } from "@mui/icons-material";
import { LegendList, Wrapper } from "./JobCalendarColorLegend.style";
import { useAuth } from "../../context/AuthContext";

type JobCalendarColorLegendProps = {
  jobs: Job[];
  view?: "users" | "jobTypes";
  onChangeView: (view: "users" | "jobTypes") => void;
};

export const JobCalendarColorLegend: FC<JobCalendarColorLegendProps> = ({
  jobs,
  view = "users",
  onChangeView,
}) => {
  const { isInGroup } = useAuth();
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

  const changeViewHandler: (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => void = (_event, view) => {
    onChangeView(view as "users" | "jobTypes");
  };

  return (
    <Wrapper>
      {isInGroup("Admin") && (
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={changeViewHandler}
          aria-label="text alignment"
        >
          <ToggleButton value="jobTypes">Job Types</ToggleButton>
          <ToggleButton value="users">Users</ToggleButton>
        </ToggleButtonGroup>
      )}
      <Typography gutterBottom variant="h5" component="div">
        Color legend
      </Typography>
      <LegendList>
        {usersWithColors.map((user) => (
          <ListItem alignItems="flex-start" disablePadding key={user?.sub}>
            <ListItemIcon>
              <UserColor color={user?.color as string} />
            </ListItemIcon>
            <ListItemText primary={user?.name ?? user?.email} />
          </ListItem>
        ))}
      </LegendList>
    </Wrapper>
  );
};
