import { FC, useState } from "react";
import { Grid, Button } from "@mui/material";
import { Field, Wrapper, Background, Title } from "./EditCustomerForm.style";
import { Customer } from "../../../../types/types";

type EditCustomerFormProps = {
  onEdit: (customer: Customer) => void;
  onCancel: () => void;
  customer: Customer;
};

export const EditCustomerForm: FC<EditCustomerFormProps> = ({
  onEdit,
  onCancel,
  customer,
}) => {
  const [formValues, setFormValues] = useState<Customer>(customer);

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
    onEdit(formValues);
  };
  return (
    <Background>
      <Wrapper container>
        <Grid item xs={12}>
          <Title variant="h4">Edit Customer</Title>
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
                value={formValues.name}
                onChange={nameChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="address"
                label="address"
                type="text"
                fullWidth
                value={formValues.address}
                onChange={addressChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="postcode"
                label="postcode"
                type="text"
                fullWidth
                value={formValues.postcode}
                onChange={postcodeChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="mainTelephone"
                label="Main Telephone"
                type="text"
                fullWidth
                value={formValues.mainTelephone}
                onChange={mainTelephoneChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="secondTelephone"
                label="secondTelephone"
                type="text"
                fullWidth
                value={formValues.secondTelephone}
                onChange={secondTelephoneChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="email"
                label="email"
                type="email"
                fullWidth
                value={formValues.email}
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
                Update
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
