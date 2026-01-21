import React, { FC, useCallback, useMemo, useState } from "react";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import {
  Calendar,
  EventProps,
  SlotInfo,
  View,
  Views,
  momentLocalizer,
  type Event as RBCEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Popover } from "@mui/material";

import { Job, JobStatus } from "../../types/types";
import { ErrorCode } from "../../services/error";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";
import { useAuth } from "../../context/AuthContext";

import { GenericJobModal } from "../GenericJobModal/GenericJobModal";
import { JobCard } from "../JobCard/JobCard";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import CheckIcon from "@mui/icons-material/Check";
import {
  CalendarWrapper,
  CheckCircle,
  CheckWrapper,
} from "./JobCalendar.style";

moment.updateLocale("en", { week: { dow: 1 } });

export const DEFAULT_COLOR = "#3174ad";
export const CANCELED_COLOR = "#979da0ff";

const BACKGROUND_TO_TEXT: Record<string, string> = {
  [DEFAULT_COLOR]: "white",
  [CANCELED_COLOR]: "white",
  "#cddc39": "black",
  "#ffeb3b": "black",
  "#ffc107": "black",
};

type JobCalendarsProps = {
  loading?: boolean;
  error?: ErrorCode | null;
  jobs: Job[];
  isMobile?: boolean;
  view: View;
  date: Date;
  onViewChange: (view: View) => void;
  onNavigate: (date: Date) => void;
  rangeStart: Date;
  rangeEnd: Date;
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

const toDateTime = (date: string, time: string) => new Date(`${date}T${time}`);

export const JobCalendars: FC<JobCalendarsProps> = ({
  loading,
  error,
  jobs,
  isMobile,
  view,
  date,
  onViewChange,
  onNavigate,
  rangeStart,
  rangeEnd,
  onJobsChanged,
  colorLegendView,
}) => {
  const localizer = useMemo(() => momentLocalizer(moment), []);

  const [eventJob, setEventJob] = useState<Job | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);

  const jobType = useJobTypeGetter();
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  const open = Boolean(anchorEl);
  const handlePopoverClose = () => setAnchorEl(null);

  const getColor = useCallback(
    (job: Job) => {
      if (job.status === "cancelled") return CANCELED_COLOR;

      if (colorLegendView === "users") {
        return job.assignedTo?.color ?? DEFAULT_COLOR;
      }

      if (job.jobTypeId) {
        return jobType(job.jobTypeId)?.color ?? DEFAULT_COLOR;
      }

      return DEFAULT_COLOR;
    },
    [colorLegendView, jobType]
  );

  const dynamicMin: Date = useMemo(() => {
    const fallback = dayjs(rangeStart)
      .hour(6)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
    if (view !== Views.DAY) return fallback;

    const dayStr = dayjs(date).format("YYYY-MM-DD");
    const jobsForDay = jobs.filter((j) => j.date === dayStr);
    if (jobsForDay.length === 0) return fallback;

    let earliest = dayjs(`${dayStr}T${jobsForDay[0].startTime}`);
    for (const j of jobsForDay) {
      const t = dayjs(`${dayStr}T${j.startTime}`);
      if (t.isBefore(earliest)) earliest = t;
    }
    return earliest.toDate();
  }, [view, jobs, date, rangeStart]);

  const maxTime: Date = useMemo(() => {
    return dayjs(rangeEnd).hour(17).minute(0).second(0).millisecond(0).toDate();
  }, [rangeEnd]);

  const events: CalendarEvent[] = useMemo(() => {
    return jobs.map((job) => {
      const resource: CalendarJobResource = {
        ...job,
        color: getColor(job),
        calendarView: view,
        isMobile: !!isMobile,
      };

      const title = `${job.address ?? job.customer?.address ?? ""} ${
        job.postcode ?? job.customer?.postcode ?? ""
      }`.trim();

      return {
        resource,
        title,
        start: toDateTime(job.date, job.startTime),
        end: toDateTime(job.date, job.endTime),
      };
    });
  }, [jobs, getColor, view, isMobile]);

  const eventClickHandler = (
    event: CalendarEvent,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    if (!event.resource) return;
    setEventJob(event.resource);
    setAnchorEl(e.currentTarget);
  };

  const calendarClickHandler = (slotInfo: SlotInfo) => {
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const resource = event.resource;
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
          <Calendar<CalendarEvent>
            style={{ height: "100%" }}
            localizer={localizer}
            events={events}
            showAllEvents={false}
            popup={true}
            onShowMore={(_events, d) => {
              onViewChange(Views.DAY);
              onNavigate(d);
            }}
            drilldownView={Views.DAY}
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
            date={date}
            onView={onViewChange}
            onNavigate={onNavigate}
            onSelectEvent={eventClickHandler}
            onSelectSlot={calendarClickHandler}
            selectable
            step={30}
            min={dynamicMin}
            max={maxTime}
            eventPropGetter={eventPropGetter}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const textStyle: React.CSSProperties = isMonthView
    ? {
        fontSize: useSmallFont ? "0.65rem" : "0.8rem",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }
    : {
        fontSize: useSmallFont ? "0.65rem" : "0.9rem",
        lineHeight: useSmallFont ? 1.1 : 1.3,
        whiteSpace: "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
      };

  return (
    <div style={{ position: "relative" }}>
      {isCompleted && (
        <CheckWrapper isMonthlyView={isMonthView}>
          <CheckCircle>
            <CheckIcon sx={{ height: "inherit", width: "inherit" }} />
          </CheckCircle>
        </CheckWrapper>
      )}

      <div style={textStyle}>{title}</div>
    </div>
  );
};
