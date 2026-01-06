import { FC } from "react";
import { Grid } from "@mui/material";
import { Field } from "../CustomerForm/CustomerForm.style";

export type CustomerAddressFormValues = {
  name: string;
  address: string;
  postcode: string;
  id?: string;
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
  disabled?: boolean;
};

export const CustomerAddressForm: FC<CustomerAddressFormProps> = ({
  onChange,
  value,
  onBlur,
  errors,
  disabled = false,
}) => {
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const fieldChanged = event.target.name as keyof CustomerAddressFormValues;
    const newValue = event.target.value;

    onChange?.({
      ...(value ?? { name: "", address: "", postcode: "" }),
      [fieldChanged]: newValue,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          name="name"
          label="Name"
          type="text"
          fullWidth
          disabled={disabled}
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.name ?? ""}
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
          disabled={disabled}
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.address ?? ""}
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
          disabled={disabled}
          onChange={changeHandler}
          onBlur={onBlur}
          value={value?.postcode ?? ""}
          error={!!errors?.postcode}
          helperText={errors?.postcode}
        />
      </Grid>
    </Grid>
  );
};
