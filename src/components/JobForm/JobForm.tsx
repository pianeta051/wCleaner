import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { DateField, Field } from "./JobForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import dayjs, { Dayjs } from "dayjs";
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";

export type JobFormValues = {
  date: Dayjs;
  time: string;
  price: number;
};

const INITIAL_VALUES: JobFormValues = {
  date: dayjs(),
  time: "",
  price: 0,
};
const validationSchema = yup.object<JobFormValues>({
  date: yup.date(),
  time: yup.string(),
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
  onDelete,
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

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={columns}>
          <DateField
            name="date"
            onChange={dateChangeHandler}
            value={formik.values.date}
            autoFocus
            label="date"
            minDate={dayjs()}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="time"
            id="time"
            label="time"
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.time}
            error={!!(formik.touched.time && formik.errors.time)}
            helperText={formik.touched.time ? formik.errors.time : undefined}
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
            value={formik.values.price}
            error={!!(formik.touched.price && formik.errors.price)}
            helperText={formik.touched.price ? formik.errors.price : undefined}
          />
        </Grid>

        <Grid item xs={12} textAlign="center">
          <LoadingButton
            variant="contained"
            color="primary"
            style={{ textTransform: "none" }}
            type="submit"
            sx={{ width: "75%" }}
            loading={loading}
          >
            Save
          </LoadingButton>
          <Grid container spacing={2} item xs={12} mt={2} mb={2}>
            {onCancel && (
              <Grid item xs={6} textAlign="right">
                <Button
                  disableFocusRipple
                  disableRipple
                  style={{ textTransform: "none" }}
                  variant="outlined"
                  color="primary"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
            )}

            {onDelete && (
              <Grid item xs={6} textAlign="left">
                <DeleteButton onDelete={onDelete} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};
