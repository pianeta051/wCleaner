import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { createUser } from "../../../../services/authentication";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import {
  UserForm,
  UserFormValues,
} from "../../../../components/UserForm/UserForm";

export const CreateUserPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const submitHandler = (formValues: UserFormValues) => {
    setLoading(true);
    setError(null);
    createUser(formValues)
      .then(() => {
        setLoading(false);
        navigate("/admin/users/");
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        if (isErrorCode(error)) {
          setError(error);
        } else {
          setError("INTERNAL_ERROR");
        }
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Create user
      </Typography>
      {error && <ErrorMessage code={error} />}
      <UserForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
