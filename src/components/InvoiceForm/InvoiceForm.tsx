import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export type InvoiceFormValues = {
  description: string;
  date: Dayjs;
  address: string;
};

const INITIAL_VALUES: InvoiceFormValues = {
  date: dayjs(),
  description: "",
  address: "",
};

const validationSchema = yup.object({
  date: yup
    .mixed<Dayjs>()
    .test(
      "is-dayjs",
      "Invalid date",
      (value) => dayjs.isDayjs(value) && value.isValid()
    ),
  description: yup.string().required("Description is required"),
  address: yup.string().nullable(),
});

type InvoiceFormProps = {
  onSubmit: (formValues: InvoiceFormValues) => void;
  defaultValues?: InvoiceFormValues;
  loading?: boolean;
  onCancel?: () => void;
  addresses?: string[];
};

export const InvoiceForm: FC<InvoiceFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading,
  onCancel,
  addresses = [],
}) => {
  const formik = useFormik<InvoiceFormValues>({
    initialValues: defaultValues,
    onSubmit,
    validationSchema,
  });

  const dateChangeHandler = (value: Dayjs | null) => {
    formik.setFieldValue("date", value);
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DatePicker
          name="date"
          onChange={dateChangeHandler}
          value={formik.values.date}
          label="Date"
          format="DD/MM/YYYY"
        />

        <TextField
          name="description"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          minRows={4}
          fullWidth
          placeholder="Describe work done, services, notes etc."
          error={!!(formik.touched.description && formik.errors.description)}
          helperText={
            formik.touched.description ? formik.errors.description : undefined
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate Invoice"}
        </Button>
      </DialogActions>
    </Form>
  );
};
