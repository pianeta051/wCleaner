import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  SlotInfo,
  Event,
} from "react-big-calendar";
import { CalendarWrapper } from "./JobCalendar.style";
import { FC, useState } from "react";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { GenericJobModal } from "../GenericJobModal/GenericJobModal";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Popover } from "@mui/material";
import { Job } from "../../types/types";
import { JobCard } from "../JobCard/JobCard";
import { ErrorCode } from "../../services/error";
import { useJobTypeGetter } from "../../hooks/Jobs/useJobTypeGetter";

export const DEFAULT_COLOR = "#3174ad";
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
  "#607d8b": "white",
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
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });
  const localizer = momentLocalizer(moment);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);
  const [eventJob, setEventJob] = useState<Job>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const jobType = useJobTypeGetter();
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const getColor = (job: Job) => {
    if (colorLegendView === "users") {
      if (job.assignedTo?.color) {
        return job.assignedTo?.color;
      }
      return DEFAULT_COLOR;
    }
    if (job.jobTypeId) {
      const jobTypeColor = jobType(job.jobTypeId)?.color;
      return jobTypeColor ?? DEFAULT_COLOR;
    }
    return DEFAULT_COLOR;
  };

  const open = Boolean(anchorEl);

  const events: Event[] = jobs.map((job) => ({
    resource: {
      id: job.id,
      customer: job.customer,
      price: job.price,
      color: getColor(job),
      title: `${job.customer?.name} - ${job.customer?.address}`,
      startTime: job.startTime,
      endTime: job.endTime,
      date: job.date,
    },
    title: `${job.customer?.name} - ${job.customer?.address}`,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));

  const eventClickHandler = (
    event: Event,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const job = event.resource;
    setEventJob(job);
    setAnchorEl(e.currentTarget);
  };

  const rangeChangeHandler = (
    range: Date[] | { start: Date; end: Date },
    viewParam?: View
  ) => {
    const currentView = viewParam ?? view;
    if (currentView === Views.DAY) {
      const currentDate = (range as Date[])[0];
      onStartDayChange(dayjs(currentDate).format("YYYY-MM-DD"));
    } else if (currentView === Views.WEEK) {
      const currentMonday = (range as Date[])[0];
      onStartDayChange(dayjs(currentMonday).format("YYYY-MM-DD"));
    } else if (currentView === Views.MONTH) {
      const firstDayOfTheRange = dayjs(
        (range as { start: Date; end: Date }).start
      );
      const firstDayOfSecondWeek = firstDayOfTheRange.add(7, "day");
      const firstDayOfTheMonth = firstDayOfSecondWeek.startOf("month");
      onStartDayChange(firstDayOfTheMonth.format("YYYY-MM-DD"));
    }
  };

  const closeHandler = () => {
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
    if (event.resource) {
      return {
        style: {
          backgroundColor: event.resource.color,
          color: BACKGROUND_TO_TEXT[event.resource.color],
        },
      };
    }
    return {};
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
            onView={onViewChange}
            view={view}
            onSelectEvent={eventClickHandler}
            onSelectSlot={calendarClickHandler}
            onRangeChange={rangeChangeHandler}
            selectable
            step={30}
            min={new Date(`${startDay} 6:00`)}
            max={new Date(`${endDay} 17:00`)}
            eventPropGetter={eventProps}
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
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <JobCard job={eventJob} />
        </Popover>
      )}
      {isModalOpen && modalDate && modalStartTime && modalEndTime && (
        <GenericJobModal
          open={isModalOpen}
          onClose={closeHandler}
          onSubmit={closeHandler}
          initialValues={{
            date: modalDate,
            startTime: modalStartTime,
            endTime: modalEndTime,
            price: 0,
            assignedTo: "",
            jobTypeId: "",
          }}
        />
      )}
    </>
  );
};
