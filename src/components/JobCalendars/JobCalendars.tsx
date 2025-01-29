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

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const events: Event[] = jobs.map((job) => ({
    resource: {
      id: job.id,
      customer: job.customer,
      price: job.price,
      color: job.assignedTo?.color,
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
          }}
        />
      )}
    </>
  );
};
