import { FC } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "../CustomerForm/CustomerForm.style";

export type CleaningFrequencyUnit = "weeks" | "months";

export type CustomerAddressFormValues = {
  name: string;
  address: string;
  postcode: string;
  id?: string;
  frequency?: {
    value: number;
    unit: CleaningFrequencyUnit;
  };
};

type CustomerAddressFormProps = {
  onChange?: (formValues: CustomerAddressFormValues) => void;
  value?: CustomerAddressFormValues;
  onBlur?: () => void;
  errors?: {
    name?: string;
    address?: string;
    postcode?: string;
    frequency?: string;
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

  const frequencyValueChangeHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      onChange?.({
        ...(value ?? { name: "", address: "", postcode: "" }),
        frequency: undefined,
      });

      return;
    }

    const frequencyValue = Number(rawValue);

    onChange?.({
      ...(value ?? { name: "", address: "", postcode: "" }),
      frequency: {
        value: frequencyValue,
        unit: value?.frequency?.unit ?? "weeks",
      },
    });
  };

  const frequencyUnitChangeHandler = (unit: CleaningFrequencyUnit) => {
    if (!value?.frequency) {
      return;
    }

    onChange?.({
      ...value,
      frequency: {
        ...value.frequency,
        unit,
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
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

      <Grid size={12}>
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

      <Grid size={12}>
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

      <Grid size={12}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              name="frequencyValue"
              label="Cleaning frequency"
              type="number"
              fullWidth
              disabled={disabled}
              value={value?.frequency?.value ?? ""}
              onChange={frequencyValueChangeHandler}
              onBlur={onBlur}
              error={!!errors?.frequency}
              helperText={errors?.frequency}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={disabled || !value?.frequency}>
              <InputLabel>Frequency unit</InputLabel>

              <Select
                label="Frequency unit"
                value={value?.frequency?.unit ?? "weeks"}
                onChange={(event) =>
                  frequencyUnitChangeHandler(
                    event.target.value as CleaningFrequencyUnit
                  )
                }
              >
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
