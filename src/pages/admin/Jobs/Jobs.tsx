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
import {
  DEFAULT_CALENDAR_VIEW,
  isValidCalendarView,
  normalizeCalendarDate,
  parseCalendarDate,
} from "../../../components/JobCalendars/JobCalendar.utils";
import { CalendarContainer, PageContainer, PageHeader } from "./Jobs.style";
import { useQueueSearchParams } from "../../../hooks/utils/useQueueSearchParams";

dayjs.extend(isoWeek);

const viewToParam = (view: View): string => {
  if (view === Views.MONTH) return "month";
  if (view === Views.WEEK) return "week";

  return "day";
};

const getRangeForView = (date: Date, view: View) => {
  const d = dayjs(date);

  if (view === Views.DAY) {
    return {
      start: d.startOf("day"),
      end: d.endOf("day"),
    };
  }

  if (view === Views.WEEK) {
    const start = d.isoWeekday(1).startOf("day");
    const end = start.add(6, "day").endOf("day");

    return {
      start,
      end,
    };
  }

  return {
    start: d.startOf("month").startOf("day"),
    end: d.endOf("month").endOf("day"),
  };
};

type CalendarState = {
  view?: string;
  date?: string;
};

export const JobsPage: FC = () => {
  const [legendView, setLegendView] = useState<"users" | "jobTypes">(
    "jobTypes"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useQueueSearchParams();

  const isNewJobRoute = location.pathname === "/admin/jobs/new";

  const initialView = useMemo<View>(() => {
    const viewParam = searchParams.get("view");

    if (isValidCalendarView(viewParam)) {
      setSearchParams((params) => ({
        ...params,
        view: viewParam,
      }));
      return viewParam;
    }

    setSearchParams((params) => ({
      ...params,
      view: undefined,
    }));

    return isMobile ? Views.DAY : DEFAULT_CALENDAR_VIEW;
  }, [isMobile, searchParams]);

  const initialDate = useMemo<Date>(() => {
    const dateParam = searchParams.get("date");
    const parsedDate = parseCalendarDate(dateParam);

    setSearchParams((params) => ({
      ...params,
      date: parsedDate ? (dateParam as string) : undefined,
    }));

    return normalizeCalendarDate(parsedDate ?? dayjs(), initialView).toDate();
  }, [searchParams, initialView]);

  const [view, setView] = useState<View>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

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

  const updateCalendarUrl = (nextView: View, nextDate: Date) => {
    const normalizedDate = normalizeCalendarDate(dayjs(nextDate), nextView);

    setSearchParams({
      view: viewToParam(nextView),
      date: normalizedDate.format("DD-MM-YYYY"),
    });
  };

  const handleViewChange = (nextView: View) => {
    const normalizedDate = normalizeCalendarDate(
      dayjs(currentDate),
      nextView
    ).toDate();

    setView(nextView);
    setCurrentDate(normalizedDate);

    updateCalendarUrl(nextView, normalizedDate);
  };

  const handleNavigate = (nextDate: Date) => {
    const normalizedDate = normalizeCalendarDate(
      dayjs(nextDate),
      view
    ).toDate();

    setCurrentDate(normalizedDate);

    updateCalendarUrl(view, normalizedDate);
  };

  const handleNewJob = () => {
    navigate("/admin/jobs/new");
  };

  const handleCloseNewJob = () => {
    const normalizedDate = normalizeCalendarDate(dayjs(currentDate), view);

    navigate(
      `/admin/jobs?view=${viewToParam(view)}&date=${normalizedDate.format(
        "DD-MM-YYYY"
      )}`
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            textAlign: {
              xs: "center",
              sm: "left",
            },
            mt: "20px",
          }}
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
