import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import {
  Field,
  FormPaper,
  Title,
  Wrapper,
  Background,
} from "./ResetPassword.style";
import { Link, useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { resetPassword } from "../../../services/authentication";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";

type ResetPasswordFormData = {
  new_password: string;
  repeat_password: string;
};

const FORM_VALUES_DEFAULTS: ResetPasswordFormData = {
  new_password: "",
  repeat_password: "",
};

export const ResetPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const submitHandler: React.FormEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    resetPassword("user1@fake.email")
      .then(() => {
        setLoading(false);
        navigate("/log-in");
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
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
    <Background container>
      <Wrapper container>
        <Grid item xs={12}>
          <Title variant="h4">Reset Password</Title>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormPaper onSubmit={submitHandler}>
            <Grid container>
              <Grid item xs={12}>
                <Field
                  id="username"
                  label="New Password"
                  type="password"
                  required
                  fullWidth
                  onChange={changeHandler}
                  value={formData.new_password}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  id="username"
                  label="Repeat Password"
                  type="password"
                  required
                  fullWidth
                  onChange={changeHandler}
                  value={formData.repeat_password}
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
                  Reset Password
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
          </FormPaper>
          {error && <ErrorMessage code={error} />}
        </Grid>
      </Wrapper>
    </Background>
  );
};
