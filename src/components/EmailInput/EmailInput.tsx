import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type EmailInputProps = {
  value?: string;
  onChange?: (email: string) => void;
};

export const EmailInput: FC<EmailInputProps> = ({ value, onChange }) => {
  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  return (
    <TextField
      label="Email"
      name="email"
      variant="outlined"
      value={value}
      margin="normal"
      onChange={changeHandler}
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
