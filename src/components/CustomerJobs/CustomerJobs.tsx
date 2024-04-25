import { FC, useState } from "react";

import { Button } from "@mui/material";
import { Wrapper, Title, IconButton } from "./CustomerJobs.style";

import AddIcon from "@mui/icons-material/Add";

import { NewJobModal } from "../Jobs/NewJob/NewJob";
import { EmptyJobs } from "../EmptyJobs/EmptyJobs";
import { JobsTable } from "../JobTable/JobsTable";

import { Customer } from "../../types/types";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerJobs } from "../../hooks/Jobs/useCustomerJobs";
import { LoadingButton } from "@mui/lab";
type CustomerJobsProps = {
  customer: Customer;
};

export const CustomerJobs: FC<CustomerJobsProps> = ({ customer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { customerJobs, error, loading, moreToLoad, loadMore, loadingMore } =
    useCustomerJobs(customer.id);

  const closeHandler = () => {
    setModalOpen(false);
  };
  const openHandler = () => {
    setModalOpen(true);
  };
  if (!customerJobs) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }
  return (
    <Wrapper>
      <>
        {CustomerJobs.length === 0 ? (
          <EmptyJobs onCreateNew={openHandler} />
        ) : (
          <>
            <IconButton>
              <Button startIcon={<AddIcon />} onClick={openHandler}>
                New Job
              </Button>
            </IconButton>
            <Title>Jobs</Title>

            <JobsTable jobs={customerJobs} customer={customer} />
          </>
        )}
      </>
      <NewJobModal
        customer={customer}
        open={modalOpen}
        onClose={closeHandler}
        onSubmit={closeHandler}
      />
      {moreToLoad && (
        <LoadingButton variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </LoadingButton>
      )}
    </Wrapper>
  );
};
