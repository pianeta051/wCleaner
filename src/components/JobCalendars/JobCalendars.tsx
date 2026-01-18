import React, { FC, useMemo, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  SlotInfo,
  Event,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);

  const [eventJob, setEventJob] = useState<Job | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [calendarView, setCalendarView] = useState<View>(view);

  const jobType = useJobTypeGetter();
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  const handlePopoverClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const getColor = (job: Job) => {
    if (job.status === "cancelled") return CANCELED_COLOR;

    if (colorLegendView === "users") {
      return job.assignedTo?.color ?? DEFAULT_COLOR;
    }

    if (job.jobTypeId) {
      const jobTypeColor = jobType(job.jobTypeId)?.color;
      return jobTypeColor ?? DEFAULT_COLOR;
    }

    return DEFAULT_COLOR;
  };
  const dynamicMin = useMemo(() => {
    const fallback = dayjs(`${startDay} 06:00`);

    if (view !== Views.DAY) return fallback;

    const jobsForDay = jobs.filter((j) => j.date === startDay);
    if (jobsForDay.length === 0) return fallback;

    let earliest = dayjs(`${startDay} ${jobsForDay[0].startTime}`);
    for (const j of jobsForDay) {
      const t = dayjs(`${startDay} ${j.startTime}`);
      if (t.isBefore(earliest)) earliest = t;
    }

    return earliest;
  }, [view, jobs, startDay]);

  const events: Event[] = useMemo(() => {
    return jobs.map((job) => {
      const resource: CalendarJobResource = {
        ...job,
        color: getColor(job),
        calendarView,
        isMobile: !!isMobile,
      };

      return {
        resource,
        title: `${job.address ?? ""} ${job.postcode ?? ""}`.trim(),
        start: dayjs(`${job.date} ${job.startTime}`).toDate(),
        end: dayjs(`${job.date} ${job.endTime}`).toDate(),
      };
    });
  }, [jobs, calendarView, colorLegendView, isMobile]);

  const eventClickHandler = (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const resource = event.resource as CalendarJobResource | undefined;
    if (!resource) return;
    setEventJob(resource);
    setAnchorEl(e.currentTarget);
  };

  const navigateHandler = (date: Date) => {
    onStartDayChange(dayjs(date).format("YYYY-MM-DD"));
  };

  const viewHandler = (nextView: View) => {
    setCalendarView(nextView);
    onViewChange(nextView);
    onStartDayChange(dayjs().format("YYYY-MM-DD"));
  };

  const rangeChangeHandler = (
    _range: Date[] | { start: Date; end: Date },
    viewParam?: View
  ) => {
    const currentView = viewParam ?? view;
    setCalendarView(currentView);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
    onJobsChanged();
  };

  const calendarClickHandler = (slotInfo: SlotInfo) => {
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const eventProps = (event: Event) => {
    const resource = event.resource as CalendarJobResource | undefined;
    if (!resource) return {};
    return {
      style: {
        backgroundColor: resource.color,
        color: BACKGROUND_TO_TEXT[resource.color] ?? "white",
      },
    };
  };

  return (
    <>
      <CalendarWrapper className={loading ? "filtering" : undefined}>
        {!error ? (
          <Calendar
            localizer={localizer}
            timeslots={2}
            events={events}
            defaultView={isMobile ? Views.DAY : Views.WEEK}
            views={
              isMobile
                ? [Views.DAY, Views.MONTH]
                : [Views.DAY, Views.WEEK, Views.MONTH]
            }
            startAccessor="start"
            endAccessor="end"
            onView={viewHandler}
            view={view}
            date={dayjs(startDay).toDate()}
            onNavigate={navigateHandler}
            onSelectEvent={eventClickHandler}
            onSelectSlot={calendarClickHandler}
            onRangeChange={rangeChangeHandler}
            selectable
            step={30}
            min={dynamicMin.toDate()}
            max={dayjs(`${endDay} 17:00`).toDate()}
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
          onClose={closeModalHandler}
          onSubmit={closeModalHandler}
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

const CustomEvent: FC<EventProps<Event>> = ({ event, title }) => {
  const resource = event.resource as CalendarJobResource | undefined;
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
