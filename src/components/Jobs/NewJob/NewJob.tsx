import { Modal } from "@mui/material";
import { FC } from "react";

import { Customer, Job } from "../../../types/types";
import { Grid } from "@mui/material";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { ModalBox } from "./NewJobModal.style";
import { Background, Title, Wrapper } from "../JobForm/JobForm.style";

import { useAddJob } from "../../../hooks/Jobs/useAddJob";

type NewJobModalProps = {
  open: boolean;
  customer: Customer;
  onClose: () => void;
  onSubmit: (job: Job) => void;
};
export const NewJobModal: FC<NewJobModalProps> = ({
  open,
  customer,
  onClose,
  onSubmit,
}) => {
  const { addJob, error, loading } = useAddJob(customer.id);

  const submitHandler = (formValues: JobFormValues) => {
    addJob(formValues)
      .then((job) => {
        onSubmit(job);
        onClose;
      })
      .catch(() => {
        // Do nothing, the hook manages the error
      });
  };

  const closeHandler = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="New Job"
      aria-describedby="New Job"
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">New Job</Title>
          </Grid>
        </Wrapper>

        <Background>
          <JobForm
            onSubmit={submitHandler}
            onCancel={onClose}
            loading={loading}
          />
        </Background>
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
