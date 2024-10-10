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
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useCustomers } from "../../hooks/Customers/useCustomers";
import { Customer } from "../../types/types";

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

  const [openDialogHandle, setOpenDialogHandle] = useState(false);
  const [nextButtonDisabled, setButtonDisabled] = useState(true);

  const [slotInfo, setSlotInfo] = useState<SlotInfo>();

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: Customer) =>
      `${option.name} - ${option.address} - ${option.email} - ${option.postcode}`,
  });

  const { customers } = useCustomers();

  const [view, setView] = useState<View>(Views.WEEK);
  const [startDay, setStartDay] = useState(lastMonday);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>({
    name: "",
    address: "",
    postcode: "",
    mainTelephone: "",
    secondTelephone: "",
    email: "",
    id: "",
    slug: "",
  });
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

  const eventClickHandler = (event: Event) => {
    const job = event.resource;
    navigate(
      `/admin/customers/${job.customer.slug}?date=${job.date}&jobId=${job.id}`
    );
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

  const closeHandler = () => {
    setIsModalOpen(false);
    reload();
  };

  const openModalHandler = () => {
    setOpenDialogHandle(false);
    if (slotInfo) {
      setModalStartTime(dayjs(slotInfo.start));
      setModalEndTime(dayjs(slotInfo.end));
      setModalDate(dayjs(slotInfo.start));
    }

    setIsModalOpen(true);
  };

  const calendarClickHandler = (slotInfo: SlotInfo) => {
    setOpenDialogHandle(true);
    setSlotInfo(slotInfo);
  };

  const closeDialogHandle = () => {
    setOpenDialogHandle(false);
  };

  return (
    <>
      <CalendarWrapper className={loading ? "filtering" : undefined}>
        <Calendar
          localizer={localizer}
          timeslots={2}
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
          selectable
          step={30}
          min={new Date(`${startDay} 6:00`)}
          max={new Date(`${endDay} 17:00`)}
        />
      </CalendarWrapper>
      <Dialog
        open={openDialogHandle}
        onClose={closeDialogHandle}
        PaperProps={{
          component: "form",
          onSubmit: (event: {
            preventDefault: () => void;
            currentTarget: HTMLFormElement | undefined;
          }) => {
            event.preventDefault();

            closeDialogHandle();
          },
        }}
      >
        <DialogTitle>Assig Customer</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={customers}
            onChange={(_event, value) => {
              value ? setSelectedCustomer(value) : value;
              setButtonDisabled(false);
              if (value === null) {
                setButtonDisabled(true);
              }
            }}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            sx={{ width: "94%" }}
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  label="Select Customer"
                  sx={{ p: 2, mt: 2 }}
                  fullWidth
                />
              </>
            )}
          />
          <TextField
            disabled
            label="Address"
            id="outlined-disabled"
            value={selectedCustomer.address}
            sx={{ p: 2 }}
          />
          <TextField
            disabled
            label="Postcode"
            id="outlined-disabled"
            value={selectedCustomer.postcode}
            sx={{ p: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogHandle}>Cancel</Button>
          <Button onClick={openModalHandler} disabled={nextButtonDisabled}>
            Next
          </Button>
        </DialogActions>
      </Dialog>
      {isModalOpen && modalDate && modalStartTime && modalEndTime && (
        <JobModal
          open={isModalOpen}
          customer={selectedCustomer}
          onClose={closeHandler}
          onSubmit={() => openModalHandler}
          initialValues={{
            date: modalDate,
            startTime: modalStartTime,
            endTime: modalEndTime,
            price: 0,
          }}
        />
      )}
    </>
  );
};
