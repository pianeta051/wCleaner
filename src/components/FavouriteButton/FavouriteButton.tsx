import { FC, useState } from "react";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

type FavouriteButtonProps = {
  onActivate?: () => void;
  onDeactivate?: () => void;
  initialState?: boolean;
  disabled?: boolean;
};

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  onActivate,
  onDeactivate,
  initialState = false,
  disabled = false,
}) => {
  const [active, setActive] = useState(initialState);
  const clickHandler = () => {
    if (!disabled) {
      if (active) {
        setActive(false);
        onDeactivate?.();
      } else {
        setActive(true);
        onActivate?.();
      }
    }
  };
  return (
    <IconButton onClick={clickHandler} color="primary" disabled={disabled}>
      {active ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
};
