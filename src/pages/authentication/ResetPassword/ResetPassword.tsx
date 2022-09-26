import { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import {
  Field,
  FormPaper,
  Title,
  Wrapper,
  Background,
} from "./ResetPassword.style";
import { Link } from "react-router-dom";

type ResetPasswordFormData = {
  new_password: string;
  repeat_password: string;
};

const FORM_VALUES_DEFAULS: ResetPasswordFormData = {
  new_password: "",
  repeat_password: "",
};

export const ResetPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULS);
  const submitHandler: React.FormEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
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
                <Button
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
                  fullWidth
                >
                  Save
                </Button>
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
          </FormPaper>
        </Grid>
      </Wrapper>
    </Background>
  );
};
