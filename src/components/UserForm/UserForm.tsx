import { CardContent, CardHeader, CardMedia, TextField } from "@mui/material";
import { FC } from "react";
import { CirclePicker, ColorResult } from "react-color";
import * as yup from "yup";
import { useFormik } from "formik";

import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";

import {
  ColorCard,
  ColorPickerWrap,
  ColorPreview,
  FormContainer,
  SubmitButton,
} from "./UserForm.style";

export type UserFormValues = {
  email: string;
  password: string;
  color: string;
  name: string;
};

const EMPTY_FORM: UserFormValues = {
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
    initialValues,
    enableReinitialize: true,
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

  const getUsername = (email: string) => email.split("@")[0];

  const emailChangeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    formik.handleChange(event);

    if (!formik.touched.name) {
      const name = getUsername(event.target.value);
      formik.handleChange({ target: { name: "name", value: name } });
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormContainer>
        <EmailInput
          value={formik.values.email}
          onChange={emailChangeHandler}
          errorMessage={
            formik.touched.email ? (formik.errors.email as string) : ""
          }
        />

        <TextField
          fullWidth
          label="Name"
          name="name"
          variant="outlined"
          margin="normal"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.name && formik.errors.name)}
          helperText={formik.touched.name ? (formik.errors.name as string) : ""}
        />

        <PasswordInput
          value={formik.values.password}
          onChange={formik.handleChange}
          showRestrictions={!isUpdate}
          label={isUpdate ? "Password" : "Password *"}
          errorMessage={
            formik.touched.password ? (formik.errors.password as string) : ""
          }
        />

        <ColorCard>
          <CardHeader title="Pick a color" />
          <CardMedia
            component={ColorPreview}
            sx={{ backgroundColor: formik.values.color }}
          />
          <CardContent>
            <ColorPickerWrap>
              <CirclePicker
                color={formik.values.color}
                onChange={colorChangeHandler}
              />
            </ColorPickerWrap>
          </CardContent>
        </ColorCard>

        <SubmitButton variant="outlined" type="submit" disabled={loading}>
          {loading ? "SAVING..." : "SAVE"}
        </SubmitButton>
      </FormContainer>
    </Form>
  );
};
