import { momentLocalizer, View, Views } from "react-big-calendar";
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
import { CalendarContainer } from "./Jobs.style";

export const JobsPage: FC = () => {
  const [view, setView] = useState<"users" | "jobTypes">("jobTypes");
  dayjs.extend(isoWeek);
  const today = dayjs().format("YYYY-MM-DD");
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [startDay, setStartDay] = useState(isMobile ? today : lastMonday);
  const [calendarView, setCalendarView] = useState<View>(
    isMobile ? Views.DAY : Views.WEEK
  );

  const changeCalendarViewHandler: (view: "users" | "jobTypes") => void = (
    view
  ) => {
    setView(view);
  };

  const endDay = useMemo(() => {
    if (calendarView === Views.DAY) {
      return startDay;
    }
    if (calendarView === Views.WEEK) {
      return dayjs(startDay).add(6, "days").format("YYYY-MM-DD");
    }
    if (calendarView === Views.MONTH) {
      return dayjs(startDay).endOf("month").format("YYYY-MM-DD");
    }
    return "";
  }, [startDay, calendarView]);
  const { jobs, error, loading, reload } = useJobs(
    { start: `${startDay} 00:00`, end: `${endDay} 23:59` },
    "desc",
    false
  );

  const viewChangeHandler = (view: View) => {
    setCalendarView(view);
  };

  const startDayChangeHanlder = (startDay: string) => {
    setStartDay(startDay);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>

      <Grid container justifyContent="flex-end"></Grid>
      <CalendarContainer>
        <JobCalendars
          loading={loading}
          error={error}
          jobs={jobs}
          isMobile={isMobile}
          onViewChange={viewChangeHandler}
          view={calendarView}
          onStartDayChange={startDayChangeHanlder}
          startDay={startDay}
          endDay={endDay}
          onJobsChanged={reload}
        />
        <JobCalendarColorLegend
          jobs={jobs}
          view={view}
          onChangeView={changeCalendarViewHandler}
        />
      </CalendarContainer>
    </>
  );
};
