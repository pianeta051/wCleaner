import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { Field } from "./CustomerForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";

export type CustomerFormValues = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone: string;
  secondTelephone: string;
  email: string;
};

const INITIAL_VALUES: CustomerFormValues = {
  name: "",
  address: "",
  postcode: "",
  mainTelephone: "",
  secondTelephone: "",
  email: "",
};
const validationSchema = yup.object<CustomerFormValues>({
  email: yup.string().email().required(),
  name: yup.string().required(),
});

type CustomerFormProps = {
  onSubmit: (customer: CustomerFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initialValues?: CustomerFormValues;
  loading?: boolean;
  layout?: "vertical" | "horizontal";
};

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  onDelete,
  initialValues = INITIAL_VALUES,
  loading = false,
  layout = "vertical",
}) => {
  const formik = useFormik<CustomerFormValues>({
    initialValues: initialValues,
    onSubmit,
    validationSchema,
  });
  const columns = layout === "vertical" ? 12 : 4;

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={columns}>
          <Field
            name="name"
            id="name"
            label="name"
            type="text"
            autoFocus
            required
            onChange={formik.handleChange}
            value={formik.values.name}
            error={!!(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name ? formik.errors.name : undefined}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="address"
            id="address"
            label="address"
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.address}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="postcode"
            id="postcode"
            label="postcode"
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.postcode}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="mainTelephone"
            id="mainTelephone"
            label="main telephone"
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.mainTelephone}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="secondTelephone"
            id="secondTelephone"
            label="second telephone"
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.secondTelephone}
          />
        </Grid>
        <Grid item xs={12} md={columns}>
          <Field
            name="email"
            id="email"
            label="email"
            type="email"
            fullWidth
            required
            onChange={formik.handleChange}
            value={formik.values.email}
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
        </Grid>
        {onCancel && (
          <Grid item xs={12} textAlign="center">
            <Button
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="text"
              color="primary"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="text"
              color="warning"
              onClick={onDelete}
            >
              Delete
            </Button>
          </Grid>
        )}
      </Grid>
    </Form>
  );
};
