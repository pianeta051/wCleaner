import { momentLocalizer, Views } from "react-big-calendar";
import {
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import isoWeek from "dayjs/plugin/isoWeek";
import moment from "moment";
import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";
import { useJobs } from "../../../hooks/Jobs/useJobs";
import dayjs, { Dayjs } from "dayjs";
import { JobCalendarColorLegend } from "../../../components/JobCalendarColorLegend/JobCalendarColorLegend";

export const JobsPage: FC = () => {
  const [view, setView] = useState("users");
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  dayjs.extend(isoWeek);
  const today = dayjs().format("YYYY-MM-DD");
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [startDay, setStartDay] = useState(isMobile ? today : lastMonday);
  const [showColorLegent, setShowColorLegent] = useState(false);
  const changeViewHandler: (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => void = (_event, view) => {
    setView(view);
  };
  const endDay = useMemo(() => {
    if (view === Views.DAY) {
      return startDay;
    }
    if (view === Views.WEEK) {
      return dayjs(startDay).add(6, "days").format("YYYY-MM-DD");
    }
    if (view === Views.MONTH) {
      return dayjs(startDay).endOf("month").format("YYYY-MM-DD");
    }
    return "";
  }, [startDay, view]);
  const { jobs, error, loading, reload } = useJobs(
    { start: `${startDay} 00:00`, end: `${endDay} 23:59` },
    "desc",
    false
  );
  const usersHandler = () => {
    setShowColorLegent(true);
  };
  const jobTypesHandler = () => {
    setShowColorLegent(false);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>

      <Grid container justifyContent="flex-end">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={changeViewHandler}
          aria-label="text alignment"
        >
          <ToggleButton value="jobTypes" onClick={jobTypesHandler}>
            Job Types
          </ToggleButton>
          <ToggleButton value="users" onClick={usersHandler}>
            Users
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      {showColorLegent ? <JobCalendarColorLegend jobs={jobs} /> : null}

      <JobCalendars />
    </>
  );
};
