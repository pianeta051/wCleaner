import { FC, useState } from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import { Wrapper, Title, IconButton } from "./CustomerJobs.style";

import { CustomerJobModal } from "../CustomerJobModal/CustomerJobModal";
import { EmptyJobs } from "../EmptyJobs/EmptyJobs";
import { JobsTable } from "../JobTable/JobsTable";
import { Customer } from "../../types/types";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type CustomerJobsProps = {
  customer: Customer;
};

export const CustomerJobs: FC<CustomerJobsProps> = ({ customer }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const date = searchParams.get("date");
  const jobId = searchParams.get("jobId");
  const { user } = useAuth();
  dayjs.extend(isoWeek);

  const [currentMonday, setCurrentMonday] = useState(
    dayjs(date ?? undefined)
      .isoWeekday(1)
      .format("YYYY-MM-DD")
  );
  const currentSunday = dayjs(currentMonday).add(6, "day").format("YYYY-MM-DD");
  const { customerJobs, error, loading } = useCustomerJobs(customer.id, {
    start: `${currentMonday} 00:00`,
    end: `${currentSunday} 23:59`,
  });

  const closeHandler = () => {
    {
      setModalOpen(false);
      setEditingJobId(null);
    }
  };

  const openHandler = (id?: string) => {
    if (id) {
      setEditingJobId(id);
    } else {
      setEditingJobId(null);
    }
    setModalOpen(true);
  };

  const nextWeekHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const nextMonday = dayjs(currentMonday).add(7, "day").format("YYYY-MM-DD");
    setCurrentMonday(nextMonday);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("date", nextMonday);
      return newParams;
    });
  };

  const currentWeekHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");
    setCurrentMonday(lastMonday);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("date", lastMonday);
      return newParams;
    });
  };

  const previousWeekHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    const previousMonday = dayjs(currentMonday)
      .subtract(1, "week")
      .format("YYYY-MM-DD");
    setCurrentMonday(previousMonday);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("date", previousMonday);
      return newParams;
    });
  };

  const title = `${dayjs(currentMonday).format("MMM D")} - ${dayjs(
    currentSunday
  ).format("MMM D")}`;

  if (loading) {
    return (
      <>
        <Title>{title}</Title>
        <CircularProgress />
      </>
    );
  }

  if (!customerJobs) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  const editingJob = editingJobId
    ? customerJobs.find((job) => job.id === editingJobId)
    : undefined;

  return (
    <Wrapper>
      <>
        {" "}
        <Title>Jobs</Title>
        <Stack
          spacing={2}
          direction="row"
          mt={2}
          sx={{ mb: "20px" }}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            onClick={previousWeekHandler}
            startIcon={<ArrowBackIosIcon />}
          >
            Previous Week
          </Button>
          <Button variant="outlined" onClick={currentWeekHandler}>
            Current Week
          </Button>
          <Button
            variant="outlined"
            onClick={nextWeekHandler}
            endIcon={<ArrowForwardIosIcon />}
          >
            Next Week
          </Button>
        </Stack>
        <Title>{title}</Title>
        {error ? (
          <ErrorMessage code={error} />
        ) : customerJobs.length === 0 ? (
          <EmptyJobs onCreateNew={() => openHandler()} />
        ) : (
          <>
            <IconButton>
              <Button startIcon={<AddIcon />} onClick={() => openHandler()}>
                New Job
              </Button>
            </IconButton>

            <JobsTable
              jobs={customerJobs}
              jobIdSelected={jobId}
              customer={customer}
              onEditClick={openHandler}
            />
          </>
        )}
      </>
      {modalOpen && (
        <CustomerJobModal
          customer={customer}
          open={modalOpen}
          onClose={closeHandler}
          onSubmit={() => openHandler}
          initialValues={
            editingJob
              ? {
                  ...editingJob,
                  date: dayjs(editingJob.date),
                  startTime: dayjs(
                    `${editingJob.date} ${editingJob.startTime}`
                  ),
                  endTime: dayjs(`${editingJob.date} ${editingJob?.endTime}`),
                  assignedTo:
                    editingJob.assignedTo?.sub ?? user?.getUsername() ?? "",
                }
              : undefined
          }
          jobId={editingJobId ?? undefined}
        />
      )}
    </Wrapper>
  );
};
