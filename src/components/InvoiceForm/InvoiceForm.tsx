import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AddressSelector } from "../AddressSelector/AddressSelector";

export type InvoiceFormValues = {
  description: string;
  date: Dayjs;
  addressId: string;
};

const INITIAL_VALUES: InvoiceFormValues = {
  date: dayjs(),
  description: "",
  addressId: "",
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
  addressId: yup.string().required("Address is required"),
});

type InvoiceFormProps = {
  onSubmit: (formValues: InvoiceFormValues) => void;
  defaultValues?: InvoiceFormValues;
  loading?: boolean;
  onCancel?: () => void;
  customerId: string;
};

export const InvoiceForm: FC<InvoiceFormProps> = ({
  onSubmit,
  defaultValues = INITIAL_VALUES,
  loading,
  onCancel,
  customerId,
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
        <AddressSelector
          value={formik.values.addressId}
          onChange={(value) =>
            formik.handleChange({ target: { value, name: "addressId" } })
          }
          onBlur={formik.handleBlur}
          error={formik.touched.addressId ? formik.errors.addressId : undefined}
          customerId={customerId}
        />
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
