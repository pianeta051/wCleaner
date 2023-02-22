import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { FC, useState } from "react";
import PasswordStrengthIndicator, {
  PasswordValidity,
} from "../PasswordStrengthIndicator/PasswordStrengthIndicator";

const isNumberRegx = /\d/;
const specialCharacterRegx = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const upperCaseRegx = /[A-Z]/;
const lowerCaseRegx = /[a-z]/;

type PasswordInputProps = {
  onChange?: (password: string) => void;
  value?: string;
  label?: string;
  name?: string;
  showRestrictions?: boolean;
};

export const PasswordInput: FC<PasswordInputProps> = ({
  onChange,
  value,
  label = "Password",
  name = "password",
  showRestrictions = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState<PasswordValidity>({
    minChar: false,
    number: false,
    specialChar: false,
    upperCase: false,
    lowerCase: false,
  });

  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }

    setPasswordValidity({
      minChar: event.target.value.length >= 8,
      number: isNumberRegx.test(event.target.value),
      specialChar: specialCharacterRegx.test(event.target.value),
      upperCase: upperCaseRegx.test(event.target.value),
      lowerCase: lowerCaseRegx.test(event.target.value),
    });
  };
  const focusHandler = () => setPasswordFocused(true);
  const blurHandler = () => setPasswordFocused(false);

  const togglePasswordVisibility = () => setShowPassword((show) => !show);

  return (
    <>
      <TextField
        fullWidth
        label={label}
        name={name}
        variant="outlined"
        value={value}
        type={showPassword ? "text" : "password"}
        margin="normal"
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {passwordFocused && showRestrictions && (
        <PasswordStrengthIndicator validity={passwordValidity} />
      )}
    </>
  );
};
