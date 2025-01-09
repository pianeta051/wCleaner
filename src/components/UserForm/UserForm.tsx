import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";
import * as yup from "yup";
import { useFormik } from "formik";

export type UserFormValues = {
  email: string;
  password: string;
  color: string;
  name: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
  color: "#f44336",
  name: "",
};
const validationSchemaCreate = yup.object<UserFormValues>({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required("Password require.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  color: yup.string().required(),
  name: yup.string(),
});

const validationSchemaUpdate = yup.object<UserFormValues>({
  email: yup.string().email().required(),
  password: yup.string(),
  color: yup.string().required(),
  name: yup.string(),
});

type UserFormProps = {
  onSubmit: (values: UserFormValues) => void;
  loading?: boolean;
  initialValues?: UserFormValues;
  isUpdate?: boolean;
};

export const UserForm: FC<UserFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
  isUpdate = false,
}) => {
  const formik = useFormik<UserFormValues>({
    initialValues: initialValues,
    onSubmit,
    validationSchema: isUpdate
      ? validationSchemaUpdate
      : validationSchemaCreate,
  });

  const colorChangeHandler = (color: ColorResult) => {
    formik.handleChange({
      target: {
        name: "color",
        value: color.hex,
      },
    });
  };
  const getUsername = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput value={formik.values.email} onChange={formik.handleChange} />

      <TextField
        label="Name "
        name="name"
        variant="outlined"
        margin="normal"
        onChange={formik.handleChange}
        value={
          formik.values.name
            ? formik.values.name
            : getUsername(formik.values.email)
        }
      />

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
        Save
      </LoadingButton>
    </Form>
  );
};
