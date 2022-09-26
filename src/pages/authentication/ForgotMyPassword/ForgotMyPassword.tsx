import { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import { Field } from "./ForgotMyPassword.style";
import { Layout } from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

type ForgotMyPasswordFormData = {
  email: string;
};

const FORM_VALUES_DEFAULS: ForgotMyPasswordFormData = {
  email: "",
};

export const ForgotMyPassword: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULS);
  const navigate = useNavigate();
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    navigate("/log-in");
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
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              fullWidth
              type="submit"
            >
              Reset Password
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
                Log In
              </Button>
            </Link>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
};
