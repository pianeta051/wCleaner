import { FC, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Wrapper, Title, IconButton } from "./CustomerJobs.style";
import AddIcon from "@mui/icons-material/Add";
import { JobModal } from "../JobModal/JobModal";
import { EmptyJobs } from "../EmptyJobs/EmptyJobs";
import { JobsTable } from "../JobTable/JobsTable";
import { Customer } from "../../types/types";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";

type CustomerJobsProps = {
  customer: Customer;
};

export const CustomerJobs: FC<CustomerJobsProps> = ({ customer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { customerJobs, error, loading, moreToLoad, loadMore, loadingMore } =
    useCustomerJobs(customer.id);

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

  if (loading) {
    return (
      <>
        <Title>Jobs</Title>
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
        {customerJobs.length === 0 ? (
          <EmptyJobs onCreateNew={() => openHandler()} />
        ) : (
          <>
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
              ? { ...editingJob, date: dayjs(editingJob?.date) }
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
