import { FC, useEffect, useMemo, useState } from "react";
import { View, Views } from "react-big-calendar";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";

import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";
import { JobCalendarColorLegend } from "../../../components/JobCalendarColorLegend/JobCalendarColorLegend";
import { useJobs } from "../../../hooks/Jobs/useJobs";

import { CalendarContainer, PageContainer, PageHeader } from "./Jobs.style";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { GenericJobModal } from "../../../components/GenericJobModal/GenericJobModal";

dayjs.extend(isoWeek);

const parseViewParam = (value: string | null, isMobile: boolean): View => {
  if (value === "month") return Views.MONTH;
  if (value === "week") return Views.WEEK;
  if (value === "day") return Views.DAY;
  return isMobile ? Views.DAY : Views.WEEK;
};

const viewToParam = (view: View) => {
  if (view === Views.MONTH) return "month";
  if (view === Views.WEEK) return "week";
  return "day";
};

export const JobsPage: FC = () => {
  const [legendView, setLegendView] = useState<"users" | "jobTypes">(
    "jobTypes"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNewJobRoute = location.pathname === "/admin/jobs/new";

  const initialView = useMemo(
    () => parseViewParam(searchParams.get("view"), isMobile),

    [isMobile]
  );

  const [calendarView, setCalendarView] = useState<View>(initialView);

  const [anchorDate, setAnchorDate] = useState<string>(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return today;
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("view", viewToParam(calendarView));
      return next;
    });
  }, [calendarView, setSearchParams]);

  const startDay = useMemo(() => {
    const d = dayjs(anchorDate);

    if (calendarView === Views.MONTH) {
      return d.startOf("month").format("YYYY-MM-DD");
    }
    if (calendarView === Views.WEEK) {
      return d.isoWeekday(1).format("YYYY-MM-DD");
    }
    return d.format("YYYY-MM-DD");
  }, [anchorDate, calendarView]);

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

  const viewChangeHandler = (nextView: View) => {
    setCalendarView(nextView);
    setAnchorDate(dayjs().format("YYYY-MM-DD"));
  };

  const anchorDateChangeHandler = (d: string) => {
    setAnchorDate(d);
  };

  const changeLegendViewHandler = (v: "users" | "jobTypes") => setLegendView(v);

  const handleNewJob = () => navigate("/admin/jobs/new");

  const handleCloseNewJob = () => {
    navigate(`/admin/jobs?view=${viewToParam(calendarView)}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ textAlign: { xs: "center", sm: "left", mt: "20px" } }}
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
          onStartDayChange={anchorDateChangeHandler}
          startDay={anchorDate}
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
        onSubmit={() => reload()}
      />
    </PageContainer>
  );
};
