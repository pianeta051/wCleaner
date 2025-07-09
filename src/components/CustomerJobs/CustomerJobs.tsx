import { FC, useState } from "react";
import { Button, CircularProgress, Stack, Box } from "@mui/material";
import { Wrapper, Title, IconButton } from "./CustomerJobs.style";

import { CustomerJobModal } from "../CustomerJobModal/CustomerJobModal";
import { EmptyJobs } from "../EmptyJobs/EmptyJobs";
import { JobsTable } from "../JobTable/JobsTable";
import { Customer } from "../../types/types";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type CustomerJobsProps = {
  customer: Customer;
};

const PAGE_SIZE = 10;

export const CustomerJobs: FC<CustomerJobsProps> = ({ customer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const jobId = searchParams.get("jobId");

  const { customerJobs, error, loading, reload } = useCustomerJobs(
    customer.id,
    {},
    "desc"
  );

  const closeHandler = () => {
    setModalOpen(false);
    setEditingJobId(null);
    reload();
  };

  const openHandler = (id?: string) => {
    if (id) {
      setEditingJobId(id);
    } else {
      setEditingJobId(null);
    }
    setModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <Title>Jobs</Title>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return <ErrorMessage code={error} />;
  }

  if (!customerJobs) {
    return <ErrorMessage code={"INTERNAL_ERROR"} />;
  }

  const sortedJobs = [...customerJobs].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  const displayedJobs = sortedJobs.slice(0, visibleCount);
  const canLoadMore = visibleCount < sortedJobs.length;

  const editingJob = editingJobId
    ? customerJobs.find((job) => job.id === editingJobId)
    : undefined;

  return (
    <Wrapper>
      <Title>Jobs</Title>

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
            <IconButton>
              <Button
                startIcon={<AddIcon />}
                onClick={() => openHandler()}
                variant="contained"
              >
                New Job
              </Button>
            </IconButton>
          </Stack>

          <JobsTable
            jobs={displayedJobs}
            jobIdSelected={jobId}
            customer={customer}
            onEditClick={openHandler}
          />

          {canLoadMore && (
            <Box textAlign="center" mt={2}>
              <Button
                variant="outlined"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Load more
              </Button>
            </Box>
          )}
        </>
      )}

      {modalOpen && (
        <CustomerJobModal
          customer={customer}
          open={modalOpen}
          onClose={closeHandler}
          jobId={editingJobId ?? undefined}
          initialValues={
            editingJob
              ? {
                  ...editingJob,
                  date: dayjs(editingJob.date),
                  startTime: dayjs(
                    `${editingJob.date} ${editingJob.startTime}`
                  ),
                  endTime: dayjs(`${editingJob.date} ${editingJob.endTime}`),
                  assignedTo:
                    editingJob.assignedTo?.sub ?? user?.getUsername() ?? "",
                  jobTypeId: editingJob.jobTypeId ?? "",
                }
              : undefined
          }
        />
      )}
    </Wrapper>
  );
};
