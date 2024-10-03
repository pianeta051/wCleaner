import { FC, useState } from "react";

import { CircularProgress, Typography } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import isoWeek from "dayjs/plugin/isoWeek";

import moment from "moment";
import { CalendarWrapper } from "./WeeklyJobs.style";
import "moment/locale/en-gb";

import { useJobs } from "../../hooks/Jobs/useJobs";
import { JobModal } from "../JobModal/JobModal";
import {
  View,
  Event,
  SlotInfo,
  momentLocalizer,
  Calendar,
  Views,
} from "react-big-calendar";

export const WeeklyJobs: FC = () => {
  dayjs.extend(isoWeek);
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);
  const [modalPrice, setModalPrice] = useState(0);

  const [startOfWeek, setStartOfWeek] = useState(lastMonday);
  const endOfWeek = dayjs(startOfWeek).add(6, "days").format("YYYY-MM-DD");

  const { jobs, loading, error, reload } = useJobs(
    { start: `${startOfWeek} 00:00`, end: `${endOfWeek} 23:59` },
    "desc",
    false
  );
  const navigate = useNavigate();

  const changeWeekHandler: (
    range: Date[] | { start: Date; end: Date },
    view?: View
  ) => void = (range) => {
    const firstDateofRange = Array.isArray(range) ? range[0] : range.start;
    setStartOfWeek(dayjs(firstDateofRange).format("YYYY-MM-DD"));
  };

  const eventClickHandler = (event: Event) => {
    navigate(`/jobs/${event.resource}`);
  };

  const calendarClickHandler: (slotInfo: SlotInfo) => void = (slotInfo) => {
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    reload();
    setIsModalOpen(false);
    setModalStartTime(null);
    setModalEndTime(null);
    setModalDate(null);
  };

  if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  if (error || !jobs) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Jobs
        </Typography>
        {/* <ErrorMessage code={error ?? "INTERNAL_ERROR"} /> */}
      </>
    );
  }

  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);

  const events: Event[] = jobs.map((job) => ({
    resource: job.id,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));

  return (
    <>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.WEEK, Views.MONTH, Views.DAY]}
          onRangeChange={changeWeekHandler}
          dayLayoutAlgorithm="no-overlap"
          step={60}
          timeslots={1}
          min={new Date(`${startOfWeek} 8:00`)}
          max={new Date(`${endOfWeek} 20:00`)}
          onSelectEvent={eventClickHandler}
          onSelectSlot={calendarClickHandler}
          selectable
        />
      </CalendarWrapper>
      {/* {isModalOpen && modalDate && modalStartTime && modalEndTime && (
        <JobModal
          customer={}
          onClose={closeModalHandler}
          initialValues={{
            date: modalDate,
            startTime: modalStartTime,
            endTime: modalEndTime,
            price: 0,
          }}
        />
      )} */}
    </>
  );
};
