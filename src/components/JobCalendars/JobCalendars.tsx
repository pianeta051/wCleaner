import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  SlotInfo,
  Event as RBCEvent,
  EventProps,
} from "react-big-calendar";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { Popover } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import {
  CalendarWrapper,
  CheckCircle,
  CheckWrapper,
} from "./JobCalendar.style";

import { GenericJobModal } from "../GenericJobModal/GenericJobModal";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { JobCard } from "../JobCard/JobCard";

import { Job, JobStatus } from "../../types/types";
import { ErrorCode } from "../../services/error";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";
import { useAuth } from "../../context/AuthContext";

export const DEFAULT_COLOR = "#3174ad";
export const CANCELED_COLOR = "#979da0ff";

const BACKGROUND_TO_TEXT: Record<string, string> = {
  [DEFAULT_COLOR]: "white",
  "#f44336": "white",
  "#e91e63": "white",
  "#9c27b0": "white",
  "#673ab7": "white",
  "#3f51b5": "white",
  "#2196f3": "white",
  "#03a9f4": "white",
  "#00bcd4": "white",
  "#009688": "white",
  "#4caf50": "white",
  "#8bc34a": "white",
  "#cddc39": "black",
  "#ffeb3b": "black",
  "#ffc107": "black",
  "#ff9800": "white",
  "#ff5722": "white",
  "#795548": "white",
  [CANCELED_COLOR]: "white",
};

type JobCalendarsProps = {
  loading?: boolean;
  error?: ErrorCode | null;
  jobs: Job[];
  isMobile?: boolean;
  onViewChange: (view: View) => void;
  view: View;
  onStartDayChange: (startDate: string) => void;
  startDay: string;
  endDay: string;
  onJobsChanged: () => void;
  colorLegendView: "users" | "jobTypes";
};

type CalendarJobResource = Job & {
  color: string;
  calendarView: View;
  isMobile: boolean;
};

type CalendarEvent = Omit<RBCEvent, "resource"> & {
  resource?: CalendarJobResource;
};

export const JobCalendars: FC<JobCalendarsProps> = ({
  loading,
  error,
  jobs,
  isMobile,
  onViewChange,
  view,
  onStartDayChange,
  startDay,
  endDay,
  onJobsChanged,
  colorLegendView,
}) => {
  moment.updateLocale("en", { week: { dow: 1 } });
  const localizer = momentLocalizer(moment);

  const [calendarView, setCalendarView] = useState<View>(view);
  const [eventJob, setEventJob] = useState<Job | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);

  const jobType = useJobTypeGetter();
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  useEffect(() => {
    setCalendarView(view);
  }, [view]);

  const open = Boolean(anchorEl);
  const handlePopoverClose = () => setAnchorEl(null);

  const getColor = (job: Job) => {
    if (job.status === "cancelled") return CANCELED_COLOR;

    if (colorLegendView === "users") {
      return job.assignedTo?.color ?? DEFAULT_COLOR;
    }

    if (job.jobTypeId) {
      return jobType(job.jobTypeId)?.color ?? DEFAULT_COLOR;
    }

    return DEFAULT_COLOR;
  };

  const dynamicMin: Date = useMemo(() => {
    const fallback = new Date(`${startDay} 06:00`);
    if (view !== Views.DAY) return fallback;

    const jobsForDay = jobs.filter((j) => j.date === startDay);
    if (jobsForDay.length === 0) return fallback;

    let earliest = dayjs(`${startDay} ${jobsForDay[0].startTime}`);
    for (const j of jobsForDay) {
      const t = dayjs(`${startDay} ${j.startTime}`);
      if (t.isBefore(earliest)) earliest = t;
    }

    return earliest.toDate();
  }, [view, jobs, startDay]);

  const events: CalendarEvent[] = useMemo(() => {
    return jobs.map((job) => {
      const resource: CalendarJobResource = {
        ...job,
        color: getColor(job),
        calendarView,
        isMobile: !!isMobile,
      };

      return {
        resource,
        title: `${job.address ?? job.customer?.address ?? ""} ${
          job.postcode ?? job.customer?.postcode ?? ""
        }`.trim(),
        start: new Date(`${job.date} ${job.startTime}`),
        end: new Date(`${job.date} ${job.endTime}`),
      };
    });
  }, [jobs, calendarView, isMobile, colorLegendView]);

  const eventClickHandler = (
    event: CalendarEvent,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const resource = event.resource;
    if (!resource) return;

    setEventJob(resource);
    setAnchorEl(e.currentTarget);
  };

  const rangeChangeHandler = (
    range: Date[] | { start: Date; end: Date },
    viewParam?: View
  ) => {
    const currentView = viewParam ?? view;
    setCalendarView(currentView);

    if (currentView === Views.DAY) {
      onStartDayChange(dayjs((range as Date[])[0]).format("YYYY-MM-DD"));
      return;
    }

    if (currentView === Views.WEEK) {
      onStartDayChange(dayjs((range as Date[])[0]).format("YYYY-MM-DD"));
      return;
    }

    if (currentView === Views.MONTH) {
      onStartDayChange(
        dayjs((range as { start: Date }).start).format("YYYY-MM-DD")
      );
    }
  };

  const calendarClickHandler = (slotInfo: SlotInfo) => {
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const eventProps = (event: CalendarEvent) => {
    const resource = event.resource;
    if (!resource) return {};

    return {
      style: {
        backgroundColor: resource.color,
        color: BACKGROUND_TO_TEXT[resource.color] ?? "white",
      },
    };
  };

  const navigateHandler = (date: Date, viewParam?: View) => {
    const currentView = viewParam ?? view;

    if (currentView === Views.MONTH) {
      onStartDayChange(dayjs(date).startOf("month").format("YYYY-MM-DD"));
      return;
    }

    if (currentView === Views.WEEK) {
      onStartDayChange(dayjs(date).isoWeekday(1).format("YYYY-MM-DD"));
      return;
    }

    onStartDayChange(dayjs(date).format("YYYY-MM-DD"));
  };

  return (
    <>
      <CalendarWrapper className={loading ? "filtering" : undefined}>
        {!error ? (
          <Calendar<CalendarEvent>
            localizer={localizer}
            events={events}
            timeslots={2}
            defaultView={isMobile ? Views.DAY : Views.WEEK}
            views={
              isMobile
                ? [Views.DAY, Views.MONTH]
                : [Views.DAY, Views.WEEK, Views.MONTH]
            }
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={new Date(startDay)}
            onView={onViewChange}
            onNavigate={(date) =>
              onStartDayChange(dayjs(date).format("YYYY-MM-DD"))
            }
            onRangeChange={rangeChangeHandler}
            onSelectEvent={eventClickHandler}
            onSelectSlot={calendarClickHandler}
            selectable
            step={30}
            min={dynamicMin}
            max={new Date(`${endDay} 17:00`)}
            eventPropGetter={eventProps}
            components={{
              event: CustomEvent as unknown as any,
            }}
          />
        ) : (
          <ErrorMessage code={error} />
        )}
      </CalendarWrapper>

      {eventJob && (
        <Popover
          anchorEl={anchorEl}
          open={open}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <JobCard job={eventJob} onJobChanged={onJobsChanged} />
        </Popover>
      )}

      {isModalOpen && modalDate && modalStartTime && modalEndTime && isAdmin && (
        <GenericJobModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {
            setIsModalOpen(false);
            onJobsChanged();
          }}
          initialValues={{
            date: modalDate,
            startTime: modalStartTime,
            endTime: modalEndTime,
            price: 0,
            assignedTo: "",
            jobTypeId: "",
            addressId: "",
            status: "pending" as JobStatus,
            paymentMethod: "none",
          }}
        />
      )}
    </>
  );
};

const CustomEvent: FC<EventProps<CalendarEvent>> = ({ event, title }) => {
  const resource = event.resource;
  if (!resource) return null;

  const isCompleted = resource.status === "completed";
  const isMonthView = resource.calendarView === Views.MONTH;
  const useSmallFont = isMonthView && resource.isMobile;

  return (
    <div style={{ position: "relative" }}>
      {isCompleted && (
        <CheckWrapper isMonthlyView={isMonthView}>
          <CheckCircle>
            <CheckIcon sx={{ height: "inherit", width: "inherit" }} />
          </CheckCircle>
        </CheckWrapper>
      )}

      <div
        style={{
          fontSize: useSmallFont ? "0.65rem" : "0.9rem",
          lineHeight: useSmallFont ? 1.1 : 1.3,
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>
    </div>
  );
};
