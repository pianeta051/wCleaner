import { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import { Field, Wrapper, Background, Title } from "./NewCustomerForm.style";
import { Customer } from "../../../../types/types";

const INITIAL_VALUES: Customer = {
  name: "",
  address: "",
  postcode: "",
  mainTelephone: "",
  secondTelephone: "",
  email: "",
  url: "",
};
type NewCustomerFormProps = {
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
};

export const NewCustomerForm: FC<NewCustomerFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState<Customer>(INITIAL_VALUES);

  const nameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormValues((formValues) => ({
      ...formValues,
      name: event.target.value,
    }));
  };
  const addressChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormValues((formValues) => ({
      ...formValues,
      address: event.target.value,
    }));
  };
  const postcodeChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormValues((formValues) => ({
      ...formValues,
      postcode: event.target.value,
    }));
  };

  const mainTelephoneChangeHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setFormValues((formValues) => ({
      ...formValues,
      mainTelephone: event.target.value,
    }));
  };

  const secondTelephoneChangeHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setFormValues((formValues) => ({
      ...formValues,
      secondTelephone: event.target.value,
    }));
  };

  const emailChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormValues((formValues) => ({
      ...formValues,
      email: event.target.value,
      url: event.target.value,
    }));
  };
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(formValues);
    setFormValues(INITIAL_VALUES);
  };
  return (
    <Background>
      <Wrapper container>
        <Grid item xs={12}>
          <Title variant="h4">New Customer</Title>
        </Grid>
        <form onSubmit={submitHandler}>
          <Grid container>
            <Grid item xs={12}>
              <Field
                id="name"
                label="name"
                type="text"
                autoFocus
                required
                fullWidth
                onChange={nameChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="address"
                label="address"
                type="text"
                fullWidth
                onChange={addressChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="postcode"
                label="postcode"
                type="text"
                fullWidth
                onChange={postcodeChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="mainTelephone"
                label="Main Telephone"
                type="text"
                fullWidth
                onChange={mainTelephoneChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="secondTelephone"
                label="secondTelephone"
                type="text"
                fullWidth
                onChange={secondTelephoneChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="email"
                label="email"
                type="email"
                fullWidth
                onChange={emailChangeHandler}
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
                Submit
              </Button>
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
        </form>
      </Wrapper>
    </Background>
  );
};
