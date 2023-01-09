import { FC, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";

import {
  Field,
  FormWrapper,
  Title,
  Wrapper,
  Background,
} from "./SetPassword.style";
import { Link, useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../../services/error";
import { LoadingButton } from "@mui/lab";
import { ErrorMessage } from "../../../components/ErrorMessage/ErrorMessage";
import { setPassword } from "../../../services/authentication";
import { Form } from "../../../components/Form/Form";

type SetPasswordValues = {
  password: string;
};

const FORM_VALUES_DEFAULTS = {
  password: "",
};

type SetPasswordProps = {
  onSubmit?: (values: SetPasswordValues) => void;
  loading?: boolean;
  initialValues?: SetPasswordValues;
};
export const SetPassword: FC<SetPasswordProps> = ({
  initialValues = FORM_VALUES_DEFAULTS,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialValues);
  const submitHandler = () => {
    setLoading(true);
    setError(null);
    setPassword(formData.password)
      .then(() => {
        setLoading(false);
        navigate("/admin/customers");
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
          <Typography>
            This is your first time logging in. Please set your password.
          </Typography>
          <FormWrapper>
            <Form onSubmit={submitHandler}>
              <Grid container>
                <Grid item xs={12}>
                  <Field
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
                      Login
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </FormWrapper>
          {error && <ErrorMessage code={error} />}
        </Grid>
      </Wrapper>
    </Background>
  );
};
