import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { DateField, Field, TimeField } from "./JobForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs, { Dayjs } from "dayjs";

import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useAuth } from "../../context/AuthContext";
import { UserSelector } from "../UserSelector/UserSelector";
import { JobTypeSelector } from "../JobTypeSelector/JobTypeSelector";

export type JobFormValues = {
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  price: number;
  assignedTo: string;
  jobTypeId: string;
  fileUrl?: string;
};

const INITIAL_VALUES: JobFormValues = {
  date: dayjs(),
  startTime: dayjs(),
  endTime: dayjs().add(1, "hour"),
  price: 0,
  assignedTo: "",
  jobTypeId: "",
  fileUrl: "",
};

const validationSchema = yup.object({
  date: yup
    .mixed<Dayjs>()
    .test(
      "is-dayjs",
      "Invalid date",
      (value) => dayjs.isDayjs(value) && value.isValid()
    ),

  startTime: yup
    .mixed<Dayjs>()
    .test(
      "is-dayjs",
      "Invalid start time",
      (value) => dayjs.isDayjs(value) && value.isValid()
    ),

  endTime: yup
    .mixed<Dayjs>()
    .test(
      "is-dayjs",
      "Invalid end time",
      (value) => dayjs.isDayjs(value) && value.isValid()
    ),

  price: yup.number().required().positive(),
  assignedTo: yup.string(),
  jobTypeId: yup.string(),
  fileUrl: yup.string(),
});

type JobFormProps = {
  onSubmit: (job: JobFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  defaultValues?: JobFormValues;
  loading?: boolean;
  layout?: "vertical" | "horizontal";
};

export const JobForm: FC<JobFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  loading = false,
  layout = "vertical",
}) => {
  const { isInGroup } = useAuth();
  const defaultValuesForm = !defaultValues ? INITIAL_VALUES : defaultValues;

  const formik = useFormik<JobFormValues>({
    initialValues: defaultValuesForm,
    onSubmit,
    validationSchema,
  });

  const changeUserHandler = (value: string | null) => {
    formik.handleChange({ target: { name: "assignedTo", value } });
  };

  const changeJobTypeHandler = (value: string | null) => {
    formik.handleChange({ target: { name: "jobTypeId", value } });
  };

  const dateChangeHandler = (value: Dayjs | null) => {
    formik.setFieldValue("date", value);
  };

  const startTimeChangeHandler = (value: Dayjs | null) => {
    formik.setFieldValue("startTime", value);
  };

  const endTimeChangeHandler = (value: Dayjs | null) => {
    formik.setFieldValue("endTime", value);
  };

  const columns = layout === "vertical" ? 12 : 4;

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3} sx={{ px: { xs: 2, md: 4 } }}>
        <Grid item xs={12} md={columns}>
          <DateField
            name="date"
            onChange={dateChangeHandler}
            value={formik.values.date}
            label="Date"
            format="DD/MM/YYYY"
          />
        </Grid>

        <Grid item xs={12} md={columns}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TimeField
                label="Start Time"
                name="startTime"
                onChange={startTimeChangeHandler}
                value={formik.values.startTime}
                views={["hours", "minutes"]}
                ampm={false}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimeField
                label="End Time"
                name="endTime"
                onChange={endTimeChangeHandler}
                value={formik.values.endTime}
                views={["hours", "minutes"]}
                ampm={false}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                minTime={formik.values.startTime}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={columns}>
          <Field
            name="price"
            label="Price"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.price}
            error={!!(formik.touched.price && formik.errors.price)}
            helperText={formik.touched.price ? formik.errors.price : undefined}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <JobTypeSelector
                value={formik.values.jobTypeId}
                onChange={changeJobTypeHandler}
              />
            </Grid>
            {isInGroup("Admin") && (
              <Grid item xs={12} md={6}>
                <UserSelector
                  value={formik.values.assignedTo}
                  onChange={changeUserHandler}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} textAlign={{ xs: "center", md: "right" }}>
          <LoadingButton
            variant="contained"
            color="primary"
            style={{ textTransform: "none" }}
            type="submit"
            sx={{ width: { xs: "100%", md: "50%" } }}
            loading={loading}
          >
            Save
          </LoadingButton>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          textAlign={{ xs: "center", md: "left" }}
          mb={2}
        >
          {onCancel && (
            <Button
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="outlined"
              color="primary"
              sx={{ width: { xs: "100%", md: "50%" } }}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </Form>
  );
};
