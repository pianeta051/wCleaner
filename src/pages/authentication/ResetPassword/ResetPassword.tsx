import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { FormPaper, Title, Wrapper, Background } from "./ResetPassword.style";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { resetPassword } from "../../../services/authentication";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { Form } from "../../../components/Form/Form";
import { PasswordInput } from "../../../components/PasswordInput/PasswordInput";

type ResetPasswordFormData = {
  newPassword: string;
};

const FORM_VALUES_DEFAULTS: ResetPasswordFormData = {
  newPassword: "",
};

export const ResetPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const submitHandler = () => {
    if (email && code) {
      setLoading(true);
      setError(null);
      resetPassword(email, code, formData.newPassword)
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
    }
  };
  const changeHandler = (password: string) => {
    setFormData({
      newPassword: password,
    });
  };

  return (
    <>
      {email === null || code == null ? (
        <>
          <Typography variant="h3" gutterBottom align="center">
            Invalid link
          </Typography>
          <ErrorMessage code="INVALID_RESET_PASSWORD_LINK" />
        </>
      ) : (
        <>
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
                        <PasswordInput
                          label="New Password"
                          onChange={changeHandler}
                          value={formData.newPassword}
                          name="newPassword"
                          showRestrictions={true}
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
        </>
      )}
    </>
  );
};
