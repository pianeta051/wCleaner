import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export type ProfilePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

const INITIAL_VALUES: ProfilePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
};

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
          onChange={(password) => changeHandler(password, "oldPassword")}
          label="Current password"
        />
        <PasswordInput
          value={formValues.newPassword}
          onChange={(password) => changeHandler(password, "newPassword")}
          label="New password"
        />
        <LoadingButton loading={loading} variant="outlined" type="submit">
          Change password
        </LoadingButton>
      </Form>
    </>
  );
};
