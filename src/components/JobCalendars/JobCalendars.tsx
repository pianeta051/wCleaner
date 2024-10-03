import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  SlotInfo,
  Event,
} from "react-big-calendar";
import { CalendarWrapper } from "./JobCalendar.style";
import { FC, useMemo, useState } from "react";
import moment from "moment";
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs, { Dayjs } from "dayjs";
import { useJobs } from "../../hooks/Jobs/useJobs";
import { JobModal } from "../JobModal/JobModal";
import { JobFormValues } from "../JobForm/JobForm";
import { useNavigate } from "react-router-dom";
import { useCustomerById } from "../../hooks/Customers/useCustomerById";
import { getCustomerById } from "../../services/customers";

export const JobCalendars: FC = () => {
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });
  const localizer = momentLocalizer(moment);
  dayjs.extend(isoWeek);
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);
  const [modalPrice, setModalPrice] = useState(0);

  const [customerSlug, setCustomerSlug] = useState("");

  const [view, setView] = useState<View>(Views.WEEK);
  const [startDay, setStartDay] = useState(lastMonday);
  const navigate = useNavigate();

  const endDay = useMemo(() => {
    if (view === Views.DAY) {
      return startDay;
    }
    if (view === Views.WEEK) {
      return dayjs(startDay).add(6, "days").format("YYYY-MM-DD");
    }
    if (view === Views.MONTH) {
      return dayjs(startDay).endOf("month").format("YYYY-MM-DD");
    }
    return "";
  }, [startDay, view]);

  const { jobs, loading, error, reload } = useJobs(
    { start: `${startDay} 00:00`, end: `${endDay} 23:59` },
    "desc",
    false
  );

  const events: Event[] = jobs.map((job) => ({
    resource: job,
    title: `${job.customer?.name} - ${job.customer?.address}`,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));

  const calendarClickHandler: (slotInfo: SlotInfo) => void = (slotInfo) => {
    console.log(slotInfo);
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const eventClickHandler = (event: Event) => {
    const job = event.resource;
    navigate(
      `/admin/customers/${job.customer.slug}?date=${job.date}&jobId=${job.id}`
    );
  };

  const closeModalHandler = () => {
    reload();
    setIsModalOpen(false);
    setModalStartTime(null);
    setModalEndTime(null);
    setModalDate(null);
  };

  const viewChangeHandler = (view: View) => {
    setView(view);
  };

  const rangeChangeHandler = (
    range: Date[] | { start: Date; end: Date },
    viewParam?: View
  ) => {
    const currentView = viewParam ?? view;
    if (currentView === Views.DAY) {
      const currentDate = (range as Date[])[0];
      setStartDay(dayjs(currentDate).format("YYYY-MM-DD"));
    } else if (currentView === Views.WEEK) {
      const currentMonday = (range as Date[])[0];
      setStartDay(dayjs(currentMonday).format("YYYY-MM-DD"));
    } else if (currentView === Views.MONTH) {
      const firstDayOfTheRange = dayjs(
        (range as { start: Date; end: Date }).start
      );
      const firstDayOfSecondWeek = firstDayOfTheRange.add(7, "day");
      const firstDayOfTheMonth = firstDayOfSecondWeek.startOf("month");
      setStartDay(firstDayOfTheMonth.format("YYYY-MM-DD"));
    }
  };

  console.log({ startDay, endDay });

  return (
    <>
      <CalendarWrapper className={loading ? "filtering" : undefined}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          startAccessor="start"
          endAccessor="end"
          onView={viewChangeHandler}
          view={view}
          onSelectEvent={eventClickHandler}
          onSelectSlot={calendarClickHandler}
          onRangeChange={rangeChangeHandler}
          step={30}
        />
      </CalendarWrapper>
      {/* {isModalOpen && modalDate && modalStartTime && modalEndTime && (
        <JobModal
          onSubmit={submitHandler}
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
