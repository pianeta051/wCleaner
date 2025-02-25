import { FC, useState } from "react";
import { JobTypeForm, JobTypeFormValues } from "../JobTypeForm/JobTypeForm";
import { JobType } from "../../types/types";
import { Grid, Modal } from "@mui/material";
import { Background, ModalBox, Title, Wrapper } from "./JobTypeModal.style";
import { addJobType, editJobType } from "../../services/jobs";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { ErrorCode, isErrorCode } from "../../services/error";

type JobTypeModalProps = {
  open: boolean;
  onSubmit: (jobType: JobType) => void;
  onClose: () => void;
  omitColors?: string[];
  editingJobType?: JobType;
};
export const JobTypeModal: FC<JobTypeModalProps> = ({
  open,
  onSubmit,
  onClose,
  omitColors,
  editingJobType,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const [loading, setLoading] = useState(false);
  const closeHandler = () => {
    setError(null);
    onClose();
  };
  const submitHandler = (formValues: JobTypeFormValues) => {
    setError(null);
    setLoading(true);
    if (editingJobType) {
      editJobType(editingJobType.id, formValues)
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
    } else {
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
    }
  };
  const title = editingJobType ? "Edit Job Type" : "New Job Type";

  let omitColorsProp = omitColors ? [...omitColors] : [];
  if (editingJobType) {
    omitColorsProp = omitColorsProp.filter(
      (color) => editingJobType.color !== color
    );
  }

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      aria-labelledby={title}
      aria-describedby={title}
    >
      <ModalBox>
        <Wrapper container>
          <Grid item xs={12}>
            <Title variant="h4">{title}</Title>
          </Grid>
        </Wrapper>
        <Background>
          <JobTypeForm
            onSubmit={submitHandler}
            loading={loading}
            omitColors={omitColorsProp}
            initialValues={editingJobType}
          />
        </Background>
        {error && <ErrorMessage code={error} />}
      </ModalBox>
    </Modal>
  );
};
