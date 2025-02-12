import { FC, useState } from "react";

import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { UserColor } from "../UserColor/UserColor";
import { Job, JobType } from "../../types/types";
import { LegendList, Wrapper } from "./JobCalendarColorLegend.style";
import { useAuth } from "../../context/AuthContext";
import { JobTypeModal } from "../JobTypeModal/JobTypeModal";

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
  const USER = "users";
  const JOBTYPE = "jobTypes";
  const { isInGroup } = useAuth();
  const [legendView, setLegendView] = useState(view);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersWithColors = jobs
    .filter((job) => !!job.assignedTo?.color)
    .map((job) => job.assignedTo)
    // remove duplicate users
    .filter(
      (user, index, self) =>
        index === self.findIndex((t) => t?.sub === user?.sub)
    );

  // This will come later from a hook
  const jobTypes: JobType[] = [
    {
      id: "lsdfljksf",
      name: "Areas",
      color: "#4caf50",
    },
  ];

  const changeViewHandler: (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => void = (_event, view) => {
    onChangeView(view as "users" | "jobTypes");
  };
  const closeHandler = () => {
    setIsModalOpen(false);
  };
  const jobTypeHandler = () => {
    setLegendView(JOBTYPE);
  };
  const userHandler = () => {
    setLegendView(USER);
  };
  const newJobTypeHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Wrapper>
        {isInGroup("Admin") && (
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={changeViewHandler}
            aria-label="text alignment"
          >
            <ToggleButton value="jobTypes" onClick={jobTypeHandler}>
              Job Types
            </ToggleButton>
            <ToggleButton value="users" onClick={userHandler}>
              Users
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        <Typography gutterBottom variant="h5" component="div">
          Color legend
        </Typography>
        {legendView === USER && usersWithColors.length ? (
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
        ) : (
          <>
            {isInGroup("Admin") && (
              <Button variant="text" onClick={newJobTypeHandler}>
                New Job Type
              </Button>
            )}
            <LegendList>
              {jobTypes.map((jobType) => (
                <ListItem
                  alignItems="flex-start"
                  disablePadding
                  key={jobType.id}
                >
                  <ListItemIcon>
                    <UserColor color={jobType.color as string} />
                  </ListItemIcon>
                  <ListItemText primary={jobType.name} />
                </ListItem>
              ))}
            </LegendList>
          </>
        )}
      </Wrapper>
      <JobTypeModal
        open={isModalOpen}
        onClose={closeHandler}
        onSubmit={closeHandler}
      />
    </>
  );
};
