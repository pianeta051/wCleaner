import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { FC } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { isNumberRegx, upperCaseRegx } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

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
  onChange: (formValues: ProfilePasswordFormValues) => void;
  loading?: boolean;
};

export const ProfilePassword: FC<ProfilePasswordProps> = ({
  onChange,
  loading = false,
}) => {
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: onChange,
  });
  const navigate = useNavigate();
  const cancelHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <Typography variant="h4">Change password</Typography>
      <Form onSubmit={formik.handleSubmit}>
        <PasswordInput
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          label="Current password"
          name="oldPassword"
        />
        <PasswordInput
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          label="New password"
          name="newPassword"
          showRestrictions={true}
        />
        <Button loading={loading} variant="outlined" type="submit">
          Change password
        </Button>
        <Button variant="text" onClick={cancelHandler}>
          CANCEL
        </Button>
      </Form>
    </>
  );
};
