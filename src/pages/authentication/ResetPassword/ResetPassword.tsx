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
import { Form } from "../../../components/Form/Form";

type ResetPasswordFormData = {
  newPassword: string;
  repeatPassword: string;
};

const FORM_VALUES_DEFAULTS: ResetPasswordFormData = {
  newPassword: "",
  repeatPassword: "",
};

export const ResetPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const submitHandler = () => {
    setLoading(true);
    setError(null);
    resetPassword("user1@fake.email", formData.newPassword)
      .then(() => {
        setLoading(false);
        navigate("/log-in");
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error)) {
          setError(error);
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
          <Form onSubmit={submitHandler}>
            <FormPaper>
              <Grid container>
                <Grid item xs={12}>
                  <Field
                    id="username"
                    label="New Password"
                    type="password"
                    required
                    fullWidth
                    onChange={changeHandler}
                    value={formData.newPassword}
                    name="newPassword"
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
                    value={formData.repeatPassword}
                    name="repeatPassword"
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
          </Form>
          {error && <ErrorMessage code={error} />}
        </Grid>
      </Wrapper>
    </Background>
  );
};
