import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { Card, CardContent, CardHeader, CardMedia } from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";
import * as yup from "yup";
import { useFormik } from "formik";

export type CreateUserFormValues = {
  email: string;
  password: string;
  color: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
  color: "#f44336",
};
const validationSchema = yup.object<CreateUserFormValues>({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required("Password require.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  color: yup.string().required(),
});

type CreateUserFormProps = {
  onSubmit: (values: CreateUserFormValues) => void;
  loading?: boolean;
  initialValues?: CreateUserFormValues;
};

export const CreateUserForm: FC<CreateUserFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<CreateUserFormValues>({
    initialValues: initialValues,
    onSubmit,
    validationSchema,
  });

  const colorChangeHandler = (color: ColorResult) => {
    formik.handleChange({
      target: {
        name: "color",
        value: color.hex,
      },
    });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput value={formik.values.email} onChange={formik.handleChange} />
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
        showRestrictions
      />
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Pick a color" />
        <CardMedia
          sx={{ backgroundColor: formik.values.color, height: 50 }}
          component="div"
        />
        <CardContent>
          <CirclePicker
            color={formik.values.color}
            onChange={colorChangeHandler}
          />
        </CardContent>
      </Card>

      <LoadingButton loading={loading} variant="outlined" type="submit">
        Create
      </LoadingButton>
    </Form>
  );
};
