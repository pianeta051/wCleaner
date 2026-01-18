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

const parseViewParam = (value: string | null, isMobile: boolean): View => {
  if (value === "month") return Views.MONTH;
  if (value === "week") return Views.WEEK;
  if (value === "day") return Views.DAY;
  return isMobile ? Views.DAY : Views.WEEK;
};

export const JobsPage: FC = () => {
  const [legendView, setLegendView] = useState<"users" | "jobTypes">(
    "jobTypes"
  );

  dayjs.extend(isoWeek);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNewJobRoute = location.pathname === "/admin/jobs/new";

  const today = dayjs().format("YYYY-MM-DD");
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const initialView = useMemo(
    () => parseViewParam(searchParams.get("view"), isMobile),

    [isMobile]
  );

  const [calendarView, setCalendarView] = useState<View>(initialView);
  const [startDay, setStartDay] = useState(() => {
    if (initialView === Views.MONTH) {
      return dayjs(today).startOf("month").format("YYYY-MM-DD");
    }
    return isMobile ? today : lastMonday;
  });

  useEffect(() => {
    const nextView = parseViewParam(searchParams.get("view"), isMobile);

    setCalendarView((prev) => {
      if (prev === nextView) return prev;

      if (nextView === Views.MONTH) {
        setStartDay((prevStart) =>
          dayjs(prevStart).startOf("month").format("YYYY-MM-DD")
        );
      }

      if (nextView === Views.WEEK && !isMobile) {
        setStartDay((prevStart) =>
          dayjs(prevStart).isoWeekday(1).format("YYYY-MM-DD")
        );
      }

      return nextView;
    });
  }, [searchParams, isMobile, today]);

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

  const viewChangeHandler = (view: View) => {
    setCalendarView(view);

    const viewParam =
      view === Views.MONTH ? "month" : view === Views.WEEK ? "week" : "day";

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("view", viewParam);
      return next;
    });
  };

  const startDayChangeHandler = (d: string) => setStartDay(d);

  const changeLegendViewHandler = (v: "users" | "jobTypes") => setLegendView(v);

  const handleNewJob = () => {
    navigate("/admin/jobs/new");
  };

  const handleCloseNewJob = () => {
    const viewParam = searchParams.get("view");
    navigate(viewParam ? `/admin/jobs?view=${viewParam}` : "/admin/jobs");
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
