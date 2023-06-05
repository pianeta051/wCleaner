import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { isNumberRegx, upperCaseRegx } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type ProfilePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

const INITIAL_VALUES: ProfilePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
};

const validationSchema = yup.object<ProfilePasswordFormValues>({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Minimum password length is 8 characters")
    .matches(isNumberRegx, "Required at least one number")
    .matches(upperCaseRegx, "Required at least Uppercase"),
});

type ProfilePasswordProps = {
  onChange?: (formValues: ProfilePasswordFormValues) => void;
  loading?: boolean;
};

export const ProfilePassword: FC<ProfilePasswordProps> = ({
  onChange,
  loading = false,
}) => {
  const [formValues, setFormValues] = useState(INITIAL_VALUES);

  const submitHandler = () => {
    if (onChange) {
      onChange(formValues);
    }
  };

  const changeHandler = (
    value: string,
    key: keyof ProfilePasswordFormValues
  ) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <>
      <Typography variant="h4">Change password</Typography>
      <Form onSubmit={submitHandler}>
        <PasswordInput
          value={formValues.oldPassword}
          onChange={(event) => changeHandler(event.target.value, "oldPassword")}
          label="Current password"
        />
        <PasswordInput
          value={formValues.newPassword}
          onChange={(event) => changeHandler(event.target.value, "newPassword")}
          label="New password"
          showRestrictions={true}
        />
        <LoadingButton loading={loading} variant="outlined" type="submit">
          Change password
        </LoadingButton>
      </Form>
    </>
  );
};
