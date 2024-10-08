import { Alert, Modal } from "@mui/material";
import { FC, useState } from "react";

import { Customer, Job } from "../../types/types";
import { Grid } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { ModalBox } from "./JobModal.style";
import { Background, Title, Wrapper } from "../JobForm/JobForm.style";

import { useAddJob } from "../../hooks/Jobs/useAddJob";
import { useCustomerEditJob } from "../../hooks/Jobs/useEditJob";

type JobModalProps = {
  open: boolean;
  customer: Customer;
  initialValues?: JobFormValues;
  jobId?: string;
  onClose: () => void;
  onSubmit: (job: Job) => void;
};
export const JobModal: FC<JobModalProps> = ({
  open,
  customer,
  jobId,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const {
    addJob,
    loading: creating,
    error: creationError,
  } = useAddJob(customer.id);
  const {
    editCustomerJob,
    loading: editing,
    error: editionError,
  } = useCustomerEditJob(customer.id, jobId);

  const submitHandler = (formValues: JobFormValues) => {
    if (jobId) {
      editCustomerJob(formValues)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
      setAlertMessage("Job Edited");
    } else {
      addJob(formValues)
        .then((job) => {
          onSubmit(job);
          onClose();
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
      setAlertMessage("Job Added");
    }
  };
  const error = creationError ?? editionError;
  const loading = editing || creating;

  const closeHandler = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby="New Job"
      aria-describedby="New Job"
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">{jobId ? "Edit Job" : "New Job"}</Title>
          </Grid>
        </Wrapper>

        <Background>
          <JobForm
            onSubmit={submitHandler}
            onCancel={closeHandler}
            loading={loading}
            defaultValues={initialValues}
          />
        </Background>
        {alertMessage.length != 0 && (
          <Alert severity="success">{alertMessage}</Alert>
        )}
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
