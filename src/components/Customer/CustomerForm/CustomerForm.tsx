import { FC, useState } from "react";
import { Button, Grid } from "@mui/material";
import { Field } from "./CustomerForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../../Form/Form";

export type CustomerFormValues = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone: string;
  secondTelephone: string;
  email: string;
};

const INITIAL_VALUES: CustomerFormValues = {
  name: "",
  address: "",
  postcode: "",
  mainTelephone: "",
  secondTelephone: "",
  email: "",
};

type CustomerFormProps = {
  onSubmit: (customer: CustomerFormValues) => void;
  onCancel: () => void;
  initialValues?: CustomerFormValues;
  errorMessage?: string;
  loading?: boolean;
};

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = INITIAL_VALUES,
  loading = false,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormValues((formValues) => ({
      ...formValues,
      [event.target.name]: event.target.value,
    }));
  };
  const submitHandler = () => {
    if (onSubmit && formValues.email) {
      onSubmit(formValues);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Grid container>
        <Grid item xs={12}>
          <Field
            name="name"
            id="name"
            label="name"
            type="text"
            autoFocus
            required
            fullWidth
            onChange={changeHandler}
            value={formValues.name}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="address"
            id="address"
            label="address"
            type="text"
            fullWidth
            onChange={changeHandler}
            value={formValues.address}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="postcode"
            id="postcode"
            label="postcode"
            type="text"
            fullWidth
            onChange={changeHandler}
            value={formValues.postcode}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="mainTelephone"
            id="mainTelephone"
            label="Main Telephone"
            type="text"
            fullWidth
            onChange={changeHandler}
            value={formValues.mainTelephone}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="secondTelephone"
            id="secondTelephone"
            label="secondTelephone"
            type="text"
            fullWidth
            onChange={changeHandler}
            value={formValues.secondTelephone}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="email"
            id="email"
            label="email"
            type="email"
            fullWidth
            onChange={changeHandler}
            value={formValues.email}
          />
        </Grid>

        <Grid item xs={12}>
          <LoadingButton
            variant="contained"
            color="primary"
            style={{ textTransform: "none" }}
            fullWidth
            type="submit"
            loading={loading}
          >
            Save
          </LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <Button
            disableFocusRipple
            disableRipple
            style={{ textTransform: "none" }}
            variant="text"
            color="primary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};
