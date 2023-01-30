import { FC, useState } from "react";
import { Grid, FormControlLabel, Checkbox, Button } from "@mui/material";
import { Field } from "./Login.style";
import { Layout } from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { logIn } from "../../../services/authentication";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";

export type LogInFormData = {
  email: string;
  password: string;
};

const FORM_VALUES_DEFAULTS: LogInFormData = {
  email: "",
  password: "",
};

export const Login: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrorCode(null);
    setLoading(true);
    logIn(formData.email, formData.password)
      .then((user) => {
        setLoading(false);
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          navigate("/set-password");
        } else {
          navigate("/admin/customers");
        }
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
    <Layout title="Welcome!" subtitle="Sign in to continue">
      <form onSubmit={submitHandler}>
        <Grid container>
          <Grid item xs={12}>
            <Field
              id="username"
              label="Username"
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
            <Field
              id="username"
              label="Password"
              type="password"
              name="password"
              required
              fullWidth
              onChange={changeHandler}
              value={formData.password}
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
              Log in
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
          </Grid>
          <Grid item xs={12}>
            <Link to="/forgot-password">
              <Button
                disableFocusRipple
                disableRipple
                style={{ textTransform: "none" }}
                variant="text"
                color="primary"
              >
                Forgot password ?
              </Button>
            </Link>
          </Grid>
        </Grid>
      </form>
      {errorCode && <ErrorMessage code={errorCode} />}
    </Layout>
  );
};
