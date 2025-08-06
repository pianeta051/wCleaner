import { FC } from "react";
import { Grid } from "@mui/material";
import { Field } from "../CustomerForm/CustomerForm.style";

export type CustomerAddressFormValues = {
  name: string;
  address: string;
  postcode: string;
};

type CustomerAddressFormProps = {
  onChange?: (formValues: CustomerAddressFormValues) => void;
  value?: CustomerAddressFormValues;
  onBlur?: () => void;
  errors?: {
    name?: string;
    address?: string;
    postcode?: string;
  };
};

export const CustomerAddressForm: FC<CustomerAddressFormProps> = ({
  onChange,
  value,
  onBlur,
  errors,
}) => {
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const fieldChanged = event.target.name;
    const newValue = event.target.value;
    const updatedValues = {
      ...value,
      [fieldChanged]: newValue,
    };
    onChange?.(updatedValues as CustomerAddressFormValues);
  };

  return (
    <>
      <Grid item xs={12}>
        <Field
          name="name"
          label="Name"
          type="text"
          fullWidth
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.name}
          error={!!errors?.name}
          helperText={errors?.name}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          name="address"
          label="Address"
          type="text"
          fullWidth
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.address}
          error={!!errors?.address}
          helperText={errors?.address}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          name="postcode"
          label="Postcode"
          type="text"
          fullWidth
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.postcode}
          error={!!errors?.postcode}
          helperText={errors?.postcode}
        />
      </Grid>
    </>
  );
};
