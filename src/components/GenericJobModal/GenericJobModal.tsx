import { FC, useState } from "react";
import { Customer, Job } from "../../types/types";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { useAddJob } from "../../hooks/Jobs/useAddJob";
import { useCustomerEditJob } from "../../hooks/Jobs/useEditJob";
import { Modal, Grid, Stepper, Step, StepLabel, Stack } from "@mui/material";

import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { CustomerSelector } from "../CustomerSelector/CustomerSelector";
import { Background, ModalBox, Title, Wrapper } from "./GenericJobModal.style";

type GenericJobModalProps = {
  open: boolean;
  initialValues?: JobFormValues;
  jobId?: string;
  onClose: () => void;
  onSubmit: (job: Job) => void;
};

export const GenericJobModal: FC<GenericJobModalProps> = ({
  open,
  jobId,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const {
    addJob,
    loading: creating,
    error: creationError,
  } = useAddJob(customer?.id);
  const {
    editCustomerJob,
    loading: editing,
    error: editionError,
  } = useCustomerEditJob(customer?.id, jobId);
  const [activeStep, setActiveStep] = useState(0);

  const submitHandler = (formValues: JobFormValues) => {
    if (jobId) {
      editCustomerJob(formValues)
        .then(() => {
          onClose();
        })
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    } else {
      addJob(formValues)
        .then((job) => {
          onSubmit(job);
          onClose();
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
    }
  };
  const error = creationError ?? editionError;
  const loading = editing || creating;

  const closeHandler = () => {
    onClose();
  };

  const selectCustomerHandler = (customer: Customer) => {
    setCustomer(customer);
    setActiveStep(1);
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
          <Stack>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Select Customer</StepLabel>
              </Step>
              <Step>
                <StepLabel>{jobId ? "Edit Job" : "Add Job"}</StepLabel>
              </Step>
            </Stepper>
            {activeStep === 0 && (
              <CustomerSelector onSelectCustomer={selectCustomerHandler} />
            )}
            {activeStep === 1 && customer && (
              <JobForm
                onSubmit={submitHandler}
                onCancel={closeHandler}
                loading={loading}
                defaultValues={initialValues}
                customerId={customer.id}
              />
            )}
          </Stack>
        </Background>
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
