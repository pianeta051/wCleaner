import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FC } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

type PasswordStrengthIndicatorItemProps = {
  isValid?: boolean;
  text?: string;
};
export const PasswordStrengthIndicatorItem: FC<
  PasswordStrengthIndicatorItemProps
> = ({ isValid, text }) => {
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        {isValid ? <CheckIcon color="success" /> : <CancelIcon color="error" />}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};
