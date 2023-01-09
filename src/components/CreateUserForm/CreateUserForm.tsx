import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export type CreateUserFormValues = {
  email: string;
  password: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
};

type CreateUserFormProps = {
  onSubmit?: (values: CreateUserFormValues) => void;
  loading?: boolean;
  initialValues?: CreateUserFormValues;
};

export const CreateUserForm: FC<CreateUserFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const submitHandler = () => {
    if (onSubmit && formValues.email.length && formValues.password.length) {
      onSubmit(formValues);
    }
  };

  const changeHandler = (value: string, key: keyof CreateUserFormValues) => {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  };

  return (
    <Form onSubmit={submitHandler}>
      <EmailInput
        value={formValues.email}
        onChange={(email) => changeHandler(email, "email")}
      />
      <PasswordInput
        value={formValues.password}
        onChange={(password) => changeHandler(password, "password")}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Create
      </LoadingButton>
    </Form>
  );
};
