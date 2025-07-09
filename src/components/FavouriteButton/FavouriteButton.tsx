import { FC, useState } from "react";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

export type FavouriteButtonProps = {
  initialState?: boolean;
  onActivate?: () => void | Promise<void>;
  onDeactivate?: () => void | Promise<void>;
  disabled?: boolean;
  readOnly?: boolean;
};

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  initialState = false,
  onActivate,
  onDeactivate,
  disabled = false,
  readOnly = false,
}) => {
  const [active, setActive] = useState(initialState);

  const handleClick = () => {
    if (disabled || readOnly) return;

    if (active) {
      setActive(false);
      onDeactivate?.();
    } else {
      setActive(true);
      onActivate?.();
    }
  };

  if (readOnly) {
    return active ? <StarIcon /> : <StarBorderIcon />;
  }

  return (
    <IconButton onClick={handleClick} color="primary" disabled={disabled}>
      {active ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};
