import { FC, useState } from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import { Wrapper, Title, IconButton } from "./CustomerJobs.style";

import { JobModal } from "../JobModal/JobModal";
import { EmptyJobs } from "../EmptyJobs/EmptyJobs";
import { JobsTable } from "../JobTable/JobsTable";
import { Customer } from "../../types/types";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import { LoadingButton } from "@mui/lab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

type CustomerJobsProps = {
  customer: Customer;
};

export const CustomerJobs: FC<CustomerJobsProps> = ({ customer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const today = dayjs().format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(today);
  const { customerJobs, error, loading, moreToLoad, loadMore, loadingMore } =
    useCustomerJobs(customer.id, {
      start: `${currentDate} 00:00`,
      end: `${currentDate} 23:59`,
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
    setCurrentDate(dayjs(currentDate).add(1, "week").format("YYYY-MM-DD"));
  };
  const currentWeekHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    const startDayWeeek = dayjs(currentDate)
      .startOf("week")
      .format("dddd, MMM D, YYYY");
    setCurrentDate(startDayWeeek);
  };
  const previousDateHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setCurrentDate(dayjs(currentDate).subtract(1, "week").format("YYYY-MM-DD"));
  };

  if (loading) {
    return (
      <>
        {/* <Title>Jobs</Title> */}
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
  const title = dayjs(currentDate).format("dddd, MMM D, YYYY");
  return (
    <Wrapper>
      <>
        {customerJobs.length === 0 ? (
          <EmptyJobs onCreateNew={() => openHandler()} />
        ) : (
          <>
            <Stack
              spacing={2}
              direction="row"
              mt={2}
              sx={{ mb: "20px" }}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                onClick={previousDateHandler}
                startIcon={<ArrowBackIosIcon />}
              >
                Previous Week
              </Button>
              <Button
                variant="outlined"
                onClick={nextWeekHandler}
                startIcon={<ArrowBackIosIcon />}
              >
                Current Week
              </Button>
              <Button
                variant="outlined"
                onClick={currentWeekHandler}
                startIcon={<ArrowBackIosIcon />}
              >
                Next Week
              </Button>
            </Stack>

            <IconButton>
              <Button startIcon={<AddIcon />} onClick={() => openHandler()}>
                New Job
              </Button>
            </IconButton>
            <Title>Jobs</Title>

            <JobsTable
              jobs={customerJobs}
              customer={customer}
              onEditClick={openHandler}
            />
          </>
        )}
      </>
      {modalOpen && (
        <JobModal
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
                }
              : undefined
          }
          jobId={editingJobId ?? undefined}
        />
      )}

      {moreToLoad && (
        <LoadingButton variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </LoadingButton>
      )}
    </Wrapper>
  );
};
