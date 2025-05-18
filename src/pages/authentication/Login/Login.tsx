import { FC, useState } from "react";
import { Layout } from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { logIn as serviceLogin } from "../../../services/authentication";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { useAuth } from "../../../context/AuthContext";
import {
  LogInForm,
  LogInFormData,
} from "../../../components/LogInForm/LogInForm";
import { Button } from "@mui/material";

export const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const { setUser, logIn } = useAuth();
  const navigate = useNavigate();
  const toForgotPassword = () => navigate("/forgot-password");
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const submitHandler = (formValues: LogInFormData) => {
    setErrorCode(null);
    setLoading(true);
    serviceLogin(formValues.email, formValues.password)
      .then((user) => {
        setLoading(false);
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          if (setUser) {
            setUser(user);
          }
          navigate("/set-password");
        } else if (logIn) {
          logIn(user);
          {
            isAdmin ? navigate("/admin/customers") : navigate("/");
          }
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

  return (
    <Layout title="Welcome!" subtitle="Sign in to continue">
      <LogInForm loading={loading} onSubmit={submitHandler} />
      <Button onClick={toForgotPassword}>Forgot your password?</Button>
      {errorCode && <ErrorMessage code={errorCode} />}
    </Layout>
  );
};
