import { List, Typography } from "@mui/material";
import { FC } from "react";
import { PasswordStrengthIndicatorItem } from "../PasswordStrengthIndicatorItem /PasswordStrengthIndicatorItem ";

export type PasswordValidity = {
  minChar: boolean;
  number: boolean;
  specialChar: boolean;
  upperCase: boolean;
  lowerCase: boolean;
};

type PasswordStrengthIndicatorProps = {
  validity: PasswordValidity;
};

export const PasswordStrengthIndicator: FC<PasswordStrengthIndicatorProps> = ({
  validity,
}) => {
  return (
    <div>
      <Typography>Password must contain:</Typography>

      <List>
        <PasswordStrengthIndicatorItem
          isValid={validity.minChar}
          text="Have at least 8 characters"
        />
        <PasswordStrengthIndicatorItem
          isValid={validity.number}
          text="Have at least 1 number"
        />
        <PasswordStrengthIndicatorItem
          isValid={validity.specialChar}
          text="Have at least 1 special character"
        />
        <PasswordStrengthIndicatorItem
          isValid={validity.upperCase}
          text="Have at least 1 uppercase character"
        />
        <PasswordStrengthIndicatorItem
          isValid={validity.lowerCase}
          text="Have at least 1 lowercase character"
        />
      </List>
    </div>
  );
};

export default PasswordStrengthIndicator;
