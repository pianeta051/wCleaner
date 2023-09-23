import { FC, useState } from "react";
import { Alert, Button, Typography } from "@mui/material";

import { Layout } from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { forgotPassword } from "../../../services/authentication";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { ForgotPasswordForm } from "../../../components/ForgotPasswordForm/ForgotPasswordForm";

type ForgotMyPasswordFormData = {
  email: string;
};

export const ForgotMyPassword: FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const toLogIn = () => navigate("/log-in");

  const submitHandler = (formData: ForgotMyPasswordFormData) => {
    setErrorCode(null);
    setLoading(true);
    forgotPassword(formData.email)
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error)) {
          setErrorCode(error);
        } else {
          setErrorCode("INTERNAL_ERROR");
        }
      });
  };

  return (
    <Layout
      title="Reset Password"
      subtitle="Enter your email address below and we will send you a link to reset your password"
    >
      {success ? (
        <Alert severity="success">
          <Typography variant="h5">We&apos;ve sent you an email</Typography>
          <Typography>Check your inbox to reset your password</Typography>
          <Link to="/log-in">Go to login</Link>
        </Alert>
      ) : (
        <ForgotPasswordForm loading={loading} onSubmit={submitHandler} />
      )}
      <Button onClick={toLogIn}>Log In</Button>
      {errorCode && <ErrorMessage code={errorCode} />}
    </Layout>
  );
};
