import { FC, useState } from "react";
import { Grid, Button, Alert, Typography } from "@mui/material";
import { Field } from "./ForgotMyPassword.style";
import { Layout } from "../Layout/Layout";
import { Link } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { resetPassword } from "../../../services/authentication";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";

type ForgotMyPasswordFormData = {
  email: string;
};

const FORM_VALUES_DEFAULTS: ForgotMyPasswordFormData = {
  email: "",
};

export const ForgotMyPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [success, setSuccess] = useState(false);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrorCode(null);
    setLoading(true);
    resetPassword(formData.email)
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

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData((formData) => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
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
        <form onSubmit={submitHandler}>
          <Grid container>
            <Grid item xs={12}>
              <Field
                id="email"
                label="Email address"
                type="email"
                name="email"
                autoFocus
                required
                fullWidth
                onChange={changeHandler}
                value={formData.email}
              />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
              >
                Reset
              </LoadingButton>
            </Grid>

            <Grid item xs={12}>
              <Link to="/log-in">
                <Button
                  disableFocusRipple
                  disableRipple
                  style={{ textTransform: "none" }}
                  variant="text"
                  color="primary"
                >
                  Log In
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      )}
      {errorCode && <ErrorMessage code={errorCode} />}
    </Layout>
  );
};
