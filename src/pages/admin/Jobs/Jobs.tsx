import { FC, useEffect, useMemo, useState } from "react";
import { View, Views } from "react-big-calendar";
import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { JobCalendars } from "../../../components/JobCalendars/JobCalendars";
import { JobCalendarColorLegend } from "../../../components/JobCalendarColorLegend/JobCalendarColorLegend";
import { useJobs } from "../../../hooks/Jobs/useJobs";
import { GenericJobModal } from "../../../components/GenericJobModal/GenericJobModal";
import { CalendarContainer, PageContainer, PageHeader } from "./Jobs.style";

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

const getRangeForView = (date: Date, view: View) => {
  const d = dayjs(date);

  if (view === Views.DAY) {
    const start = d.startOf("day");
    const end = d.endOf("day");
    return { start, end };
  }

  if (view === Views.WEEK) {
    const start = d.isoWeekday(1).startOf("day");
    const end = start.add(6, "day").endOf("day");
    return { start, end };
  }

  const start = d.startOf("month").startOf("day");
  const end = d.endOf("month").endOf("day");
  return { start, end };
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
    [isMobile, searchParams]
  );

  const [view, setView] = useState<View>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("view", viewToParam(view));
      return next;
    });
  }, [view, setSearchParams]);

  const range = useMemo(
    () => getRangeForView(currentDate, view),
    [currentDate, view]
  );

  const { jobs, error, loading, reload } = useJobs(
    {
      start: range.start.format("YYYY-MM-DD HH:mm"),
      end: range.end.format("YYYY-MM-DD HH:mm"),
    },
    "desc",
    false
  );

  const handleViewChange = (nextView: View) => {
    setView(nextView);
    setCurrentDate(new Date());
  };

  const handleNavigate = (nextDate: Date) => {
    setCurrentDate(nextDate);
  };

  const handleNewJob = () => navigate("/admin/jobs/new");

  const handleCloseNewJob = () => {
    navigate(`/admin/jobs?view=${viewToParam(view)}`);
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
          view={view}
          date={currentDate}
          onViewChange={handleViewChange}
          onNavigate={handleNavigate}
          rangeStart={range.start.toDate()}
          rangeEnd={range.end.toDate()}
          onJobsChanged={reload}
          colorLegendView={legendView}
        />

        <JobCalendarColorLegend
          jobs={jobs}
          view={legendView}
          onChangeView={setLegendView}
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
