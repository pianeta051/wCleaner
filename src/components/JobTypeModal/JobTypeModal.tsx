import { FC, useState } from "react";
import { JobTypeForm, JobTypeFormValues } from "../JobTypeForm/JobTypeForm";
import { JobType } from "../../types/types";
import { Grid, Modal } from "@mui/material";
import { Background, ModalBox, Title, Wrapper } from "./JobTypeModal.style";
import { addJobType } from "../../services/jobs";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { ErrorCode, isErrorCode } from "../../services/error";

type JobTypeModalProps = {
  open: boolean;
  onSubmit: (jobType: JobType) => void;
  onClose: () => void;
};
export const JobTypeModal: FC<JobTypeModalProps> = ({
  open,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const [loading, setLoading] = useState(false);
  const closeHandler = () => {
    onClose();
  };
  const submitHandler = (formValues: JobTypeFormValues) => {
    setError(null);
    setLoading(true);
    addJobType(formValues)
      .then((jobType) => {
        onSubmit(jobType);
        setLoading(false);
      })
      .catch((error) => {
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
        setLoading(false);
      });
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
            <Title variant="h4">New Job type</Title>
          </Grid>
        </Wrapper>
        <Background>
          <JobTypeForm onSubmit={submitHandler} loading={loading} />
        </Background>
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
