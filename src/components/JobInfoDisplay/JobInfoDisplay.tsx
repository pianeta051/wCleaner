import { FC, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Box,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

import { Customer, Job } from "../../types/types";
import { deleteFile } from "../../services/files";
import { CustomerFiles } from "../CustomerFiles/CustomerFiles";
import { useEditCustomer } from "../../hooks/Customers/useEditCustomer";
import { CustomerJobModal } from "../CustomerJobModal/CustomerJobModal";
import dayjs from "dayjs";
import { CustomerNotes } from "../CustomerNotes/CustomerNotes";
import CategoryIcon from "@mui/icons-material/Category";

type JobInfoDisplayProps = {
  job: Job;
};

export const JobInfoDisplay: FC<JobInfoDisplayProps> = ({ job }) => {
  const { editCustomer, loading, error, reload } = useEditCustomer(
    job.customer?.id,
    job.customer?.slug
  );
  const [modalOpen, setModalOpen] = useState(false);

  const assignedTo = job?.assignedTo?.name ?? job?.assignedTo?.email;

  const editCustomerHandler = async (updatedFields: Partial<Customer>) => {
    if (job.customer) {
      await editCustomer({ ...job.customer, ...updatedFields });
      reload();
    }
  };

  const deleteFileHandler = async (index: number) => {
    if (!job.customer?.fileUrls) return;
    const fileKeyToDelete = job.customer.fileUrls[index];
    const newFileKeys = job.customer.fileUrls.filter((_, i) => i !== index);

    try {
      await deleteFile(fileKeyToDelete);
      await editCustomerHandler({ fileUrls: newFileKeys });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                mb={3}
              >
                <Typography variant="h5" fontWeight="bold">
                  Job Details
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setModalOpen(true)}
                >
                  Edit Job
                </Button>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {loading && (
                <Box my={2} display="flex" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error: {error}
                </Alert>
              )}

              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CalendarTodayIcon fontSize="small" color="primary" />
                      <Typography fontWeight="bold">Date:</Typography>
                      <Typography>
                        {new Date(job.date).toDateString()}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <AccessTimeIcon fontSize="small" color="primary" />
                      <Typography fontWeight="bold">Start:</Typography>
                      <Typography>{job.startTime}</Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <AccessTimeIcon fontSize="small" color="primary" />
                      <Typography fontWeight="bold">End:</Typography>
                      <Typography>{job.endTime}</Typography>
                    </Stack>
                  </Grid>

                  {job.jobTypeName && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <CategoryIcon fontSize="small" color="primary" />
                        <Typography fontWeight="bold">Job Type:</Typography>
                        <Typography>{job.jobTypeName}</Typography>
                      </Stack>
                    </Grid>
                  )}

                  {assignedTo && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography fontWeight="bold">Assigned To:</Typography>
                        <Typography>{assignedTo}</Typography>
                      </Stack>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PointOfSaleIcon fontSize="small" color="primary" />
                      <Typography fontWeight="bold">Price:</Typography>
                      <Typography>£{job.price}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          {job.customer && (
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6}>
                <CustomerFiles
                  customer={job.customer}
                  onEditUrls={(urls) => editCustomerHandler({ fileUrls: urls })}
                  onDeleteFile={deleteFileHandler}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomerNotes customer={job.customer} />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      {job.customer && (
        <CustomerJobModal
          open={modalOpen}
          customer={job.customer}
          initialValues={{
            date: dayjs(job.date),
            startTime: dayjs(`${job.date} ${job.startTime}`),
            endTime: dayjs(`${job.date} ${job.endTime}`),
            price: job.price,
            jobTypeId: job.jobTypeId ?? "",
            assignedTo: job.assignedTo?.sub ?? "",
          }}
          jobId={job.id}
          onClose={() => {
            setModalOpen(false);
            reload();
          }}
        />
      )}
    </>
  );
};
