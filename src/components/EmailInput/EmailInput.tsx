import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type EmailInputProps = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  errorMessage?: string;
};

export const EmailInput: FC<EmailInputProps> = ({
  value,
  onChange,
  errorMessage,
}) => {
  return (
    <TextField
      label="Email"
      name="email"
      variant="outlined"
      margin="normal"
      onChange={onChange}
      error={!!errorMessage}
      helperText={errorMessage}
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle />
          </InputAdornment>
        ),
      }}
    />
  );
};
