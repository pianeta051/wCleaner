import { FC, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Modal,
  Grid,
} from "@mui/material";
import { Customer, Job } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ModalBox, Title, Wrapper } from "./CustomerJob.style";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import { useAddJob } from "../../hooks/Jobs/useAddJob";
import { useCustomerEditJob } from "../../hooks/Jobs/useEditJob";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import dayjs from "dayjs";

type CustomerJobProps = {
  customer: Customer;
  job: Job;
};

export const CustomerJob: FC<CustomerJobProps> = ({ customer, job }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    addJob,
    loading: creating,
    error: creationError,
  } = useAddJob(customer?.id);

  const {
    editCustomerJob,
    loading: editing,
    error: editionError,
  } = useCustomerEditJob(customer?.id, job.id);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const onOpen = () => {
    setIsModalOpen(true);
  };

  const INITIAL_VALUES: JobFormValues = {
    date: dayjs(job.date),
    startTime: dayjs(job.startTime),
    endTime: dayjs(job.endTime),
    price: job.price,
    assignedTo: job.assignedTo?.sub || "",
    jobTypeId: job.jobTypeId || "",
  };

  const submitHandler = (formValues: JobFormValues) => {
    if (job.id) {
      editCustomerJob(formValues)
        .then(() => {
          onClose();
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
    } else {
      addJob(formValues)
        .then(() => {
          onClose();
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
    }
  };

  const error = creationError ?? editionError;
  const loading = editing || creating;

  const handleViewAllJobs = () => {
    navigate(`/customers/${customer.id}/jobs`);
  };

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 600, margin: "auto", mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Job for {customer.name}
          </Typography>

          <Stack spacing={1}>
            <Typography>
              <strong>Date:</strong> {new Date(job.date).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Time:</strong> {new Date(job.startTime).toLocaleString()}{" "}
              - {new Date(job.endTime).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Job Address:</strong> {job.customer?.address}{" "}
              {job.customer?.postcode}
            </Typography>
            <Typography>
              <strong>Price:</strong> £{job.price}
            </Typography>
            {job.assignedTo?.name && (
              <Typography>
                <strong>Assigned To:</strong> {job.assignedTo.name}
              </Typography>
            )}
          </Stack>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onOpen} variant="contained" size="small">
              Add New Job
            </Button>
            <Button onClick={handleViewAllJobs} variant="outlined" size="small">
              View All Jobs
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={onClose}
        aria-labelledby="New Job"
        aria-describedby="New Job"
      >
        <ModalBox>
          <Wrapper container>
            <Grid item xs={12}>
              <Title variant="h4">{job.id ? "Edit Job" : "New Job"}</Title>
            </Grid>
          </Wrapper>

          <JobForm
            onSubmit={submitHandler}
            onCancel={onClose}
            loading={loading}
            defaultValues={INITIAL_VALUES}
          />

          {error && <ErrorMessage code={error} />}
        </ModalBox>
      </Modal>
    </>
  );
};
