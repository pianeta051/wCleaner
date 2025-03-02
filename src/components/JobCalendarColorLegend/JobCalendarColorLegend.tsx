import { FC, useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
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
import { useJobTypes } from "../../hooks/Jobs/useJobTypes";
import EditIcon from "@mui/icons-material/Edit";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MAX_JOB_TYPES } from "../JobTypeForm/JobTypeForm";
import { DeleteJobTypeButton } from "../DeleteJobTypeButton/DeleteJobTypeButton";

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
  const [editingJobType, setEditingJobType] = useState<JobType | undefined>(
    undefined
  );
  const usersWithColors = jobs
    .filter((job) => !!job.assignedTo?.color)
    .map((job) => job.assignedTo)
    // remove duplicate users
    .filter(
      (user, index, self) =>
        index === self.findIndex((t) => t?.sub === user?.sub)
    );

  const { jobTypes, error, loading, reload } = useJobTypes();
  const changeViewHandler: (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => void = (_event, view) => {
    onChangeView(view as "users" | "jobTypes");
  };
  const closeHandler = () => {
    setIsModalOpen(false);
    setEditingJobType(undefined);
    reload();
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
  const editJobTypeHandler = (jobTypeId: string) => {
    const jobType = jobTypes?.find((jobType) => jobType.id === jobTypeId);
    setEditingJobType(jobType);
    setIsModalOpen(true);
  };
  const omittedColors = jobTypes?.map((type) => type.color) ?? [];

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
            {isInGroup("Admin") && (jobTypes?.length ?? 0) < MAX_JOB_TYPES && (
              <Button variant="text" onClick={newJobTypeHandler}>
                New Job Type
              </Button>
            )}
            <LegendList>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <ErrorMessage code={error} />
              ) : (
                jobTypes?.map((jobType) => (
                  <ListItem disablePadding key={jobType.id}>
                    <ListItemIcon>
                      <UserColor color={jobType.color as string} />
                    </ListItemIcon>
                    <ListItemText primary={jobType.name} />
                    {isInGroup("Admin") && (
                      <IconButton
                        aria-label="edit"
                        onClick={() => editJobTypeHandler(jobType.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {isInGroup("Admin") && (
                      <DeleteJobTypeButton
                        onDelete={reload}
                        jobTypeId={jobType.id}
                      />
                    )}
                  </ListItem>
                ))
              )}
            </LegendList>
          </>
        )}
      </Wrapper>
      <JobTypeModal
        open={isModalOpen}
        onClose={closeHandler}
        onSubmit={closeHandler}
        omitColors={omittedColors}
        editingJobType={editingJobType}
      />
    </>
  );
};
