import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { DateField, Field, TimeField } from "./JobForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import {
  DateValidationError,
  PickerChangeHandlerContext,
  TimeValidationError,
} from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

export type JobFormValues = {
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  price: number;
};

const INITIAL_VALUES: JobFormValues = {
  date: dayjs(),
  startTime: dayjs(),
  endTime: dayjs().add(1, "hour"),
  price: 0,
};
const validationSchema = yup.object<JobFormValues>({
  date: yup.date(),
  startTime: yup.string(),
  endTime: yup.string(),
  price: yup.number().required().positive(),
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
  const defaultValuesForm = !defaultValues ? INITIAL_VALUES : defaultValues;
  const formik = useFormik<JobFormValues>({
    initialValues: defaultValuesForm,
    onSubmit,
    validationSchema,
  });
  const columns = layout === "vertical" ? 12 : 4;

  const dateChangeHandler: (
    value: dayjs.Dayjs | null,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => void = (value) => {
    formik.handleChange({ target: { value, name: "date" } });
  };
  const startTimeChangeHandler: (
    value: dayjs.Dayjs | null,
    context: PickerChangeHandlerContext<TimeValidationError>
  ) => void = (value) => {
    formik.handleChange({ target: { value, name: "startTime" } });
  };

  const endTimeChangeHandler: (
    value: dayjs.Dayjs | null,
    context: PickerChangeHandlerContext<TimeValidationError>
  ) => void = (value) => {
    formik.handleChange({ target: { value, name: "endTime" } });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={columns}>
          <DateField
            name="date"
            onChange={dateChangeHandler}
            value={formik.values.date}
            autoFocus
            label="Date"
            format="DD/MM/YYYY"
          />
        </Grid>

        <Grid item xs={6} md={columns}>
          <TimeField
            label="Start Time"
            name="startTime"
            onChange={startTimeChangeHandler}
            value={formik.values.startTime}
            autoFocus
            sx={{ marginY: "10px" }}
            views={["hours", "minutes"]}
            ampm={false}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
          />
          <TimeField
            label="End Time"
            name="endTime"
            onChange={endTimeChangeHandler}
            value={formik.values.endTime}
            autoFocus
            sx={{ marginY: "10px" }}
            views={["hours", "minutes"]}
            ampm={false}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            minTime={formik.values.startTime}
          />
        </Grid>

        <Grid item xs={12} md={columns}>
          <Field
            name="price"
            id="price"
            label="price"
            type="number"
            fullWidth
            onChange={formik.handleChange}
            sx={{ marginY: "10px" }}
            value={formik.values.price}
            error={!!(formik.touched.price && formik.errors.price)}
            helperText={formik.touched.price ? formik.errors.price : undefined}
          />
        </Grid>

        <Grid item xs={6} textAlign="right">
          <LoadingButton
            variant="contained"
            color="primary"
            style={{ textTransform: "none" }}
            type="submit"
            sx={{ width: "50%" }}
            loading={loading}
          >
            Save
          </LoadingButton>
        </Grid>
        <Grid item xs={6} textAlign="left" mb={2}>
          {onCancel && (
            <Button
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="outlined"
              color="primary"
              sx={{ width: "50%" }}
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
