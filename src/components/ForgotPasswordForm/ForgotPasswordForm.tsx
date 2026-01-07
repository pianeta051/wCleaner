import { Button } from "@mui/material";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import * as yup from "yup";
import { useFormik } from "formik";

export type ForgotPasswordFormData = {
  email: string;
};

const DEFAULT_FORM = {
  email: "",
};

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordFormData) => void;
  loading?: boolean;
  initialValues?: ForgotPasswordFormData;
};

const validationSchema = yup.object<ForgotPasswordFormData>({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = DEFAULT_FORM,
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput
        value={formik.values.email}
        onChange={formik.handleChange}
        errorMessage={formik.touched.email ? formik.errors.email : undefined}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        loading={loading}
      >
        Reset
      </Button>
    </Form>
  );
};
