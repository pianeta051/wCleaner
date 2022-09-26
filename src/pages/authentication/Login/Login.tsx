import { FC, useState } from "react";
import { Grid, FormControlLabel, Checkbox, Button } from "@mui/material";
import { Field } from "./Login.style";
import { Layout } from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

export type LogInFormData = {
  email: string;
  password: string;
};

const FORM_VALUES_DEFAULS: LogInFormData = {
  email: "",
  password: "",
};

export const Login: FC = () => {
  const [formData, setFormData] = useState(FORM_VALUES_DEFAULS);
  const navigate = useNavigate();
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(formData);
    navigate("/admin/customers");
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
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              fullWidth
              type="submit"
            >
              Login
            </Button>
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
    </Layout>
  );
};
