import { Button } from "@mui/material";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type LogInFormData = {
  email: string;
  password: string;
};

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LogInFormProps = {
  onSubmit: (values: LogInFormData) => void;
  loading?: boolean;
  initialValues?: LogInFormData;
};

const validationSchema = yup.object<LogInFormData>({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const LogInForm: FC<LogInFormProps> = ({
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
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
        errorMessage={
          formik.touched.password ? formik.errors.password : undefined
        }
      />
      <Button loading={loading} variant="contained" type="submit">
        Log in
      </Button>
    </Form>
  );
};
