import { FC, useMemo, useState } from "react";
import { View, Views } from "react-big-calendar";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";

import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";
import { JobCalendarColorLegend } from "../../../components/JobCalendarColorLegend/JobCalendarColorLegend";
import { useJobs } from "../../../hooks/Jobs/useJobs";

import { CalendarContainer, PageContainer, PageHeader } from "./Jobs.style";
import { useLocation, useNavigate } from "react-router-dom";
import { GenericJobModal } from "../../../components/GenericJobModal/GenericJobModal";

export const JobsPage: FC = () => {
  const [legendView, setLegendView] = useState<"users" | "jobTypes">(
    "jobTypes"
  );

  dayjs.extend(isoWeek);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const isNewJobRoute = location.pathname === "/admin/jobs/new";

  const today = dayjs().format("YYYY-MM-DD");
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const [startDay, setStartDay] = useState(isMobile ? today : lastMonday);
  const [calendarView, setCalendarView] = useState<View>(
    isMobile ? Views.DAY : Views.WEEK
  );

  const endDay = useMemo(() => {
    if (calendarView === Views.DAY) return startDay;
    if (calendarView === Views.WEEK)
      return dayjs(startDay).add(6, "days").format("YYYY-MM-DD");
    if (calendarView === Views.MONTH)
      return dayjs(startDay).endOf("month").format("YYYY-MM-DD");
    return "";
  }, [startDay, calendarView]);

  const { jobs, error, loading, reload } = useJobs(
    { start: `${startDay} 00:00`, end: `${endDay} 23:59` },
    "desc",
    false
  );

  const viewChangeHandler = (view: View) => setCalendarView(view);
  const startDayChangeHandler = (d: string) => setStartDay(d);

  const changeLegendViewHandler = (v: "users" | "jobTypes") => setLegendView(v);

  const handleNewJob = () => {
    navigate("/admin/jobs/new");
  };

  const handleCloseNewJob = () => {
    navigate("/admin/jobs");
  };

  return (
    <PageContainer>
      <PageHeader>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Jobs
        </Typography>

        <Button variant="contained" onClick={handleNewJob}>
          New job
        </Button>
      </PageHeader>

      <CalendarContainer>
        <JobCalendars
          loading={loading}
          error={error}
          jobs={jobs}
          isMobile={isMobile}
          onViewChange={viewChangeHandler}
          view={calendarView}
          onStartDayChange={startDayChangeHandler}
          startDay={startDay}
          endDay={endDay}
          onJobsChanged={reload}
          colorLegendView={legendView}
        />

        <JobCalendarColorLegend
          jobs={jobs}
          view={legendView}
          onChangeView={changeLegendViewHandler}
        />
      </CalendarContainer>
      <GenericJobModal
        key={isNewJobRoute ? "new-job" : "closed"}
        open={isNewJobRoute}
        onClose={handleCloseNewJob}
        onSubmit={() => {
          reload();
        }}
      />
    </PageContainer>
  );
};
