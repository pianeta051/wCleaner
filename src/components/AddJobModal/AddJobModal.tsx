import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { FC, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { useAddJob } from "../../hooks/Jobs/useAddJob";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Customer } from "../../types/types";
import { SlotInfo } from "react-big-calendar";
import dayjs, { Dayjs } from "dayjs";
import { JobModal } from "../JobModal/JobModal";

const [isModalOpen, setIsModalOpen] = useState(false);
const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
const [modalDate, setModalDate] = useState<Dayjs | null>(null);

const [openDialogHandle, setOpenDialogHandle] = useState(false);
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
const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option: Customer) => option.name,
});

type AddJobModalProps = {
  onClose: () => void;

  customers: Customer[];
  defaultValues?: JobFormValues;
  slotInfo?: SlotInfo;
};

export const AddJobModal: FC<AddJobModalProps> = ({
  onClose,

  customers,
  defaultValues,
  slotInfo,
}) => {
  const closeDialogHandle = () => {
    setOpenDialogHandle(false);
  };
  const closeHandler = () => {
    setIsModalOpen(false);
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
  return (
    <>
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
            onChange={(event, value) => {
              value ? setSelectedCustomer(value) : value;
            }}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Customer" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogHandle}>Cancel</Button>
          <Button onClick={openModalHandler}>Next</Button>
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
