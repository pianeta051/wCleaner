import { Button } from "@mui/material";
import { FC } from "react";

type DeleteButtonlProps = {
  onDelete: () => void;
};
export const DeleteButton: FC<DeleteButtonlProps> = ({ onDelete }) => {
  return (
    <Button
      disableFocusRipple
      disableRipple
      style={{ textTransform: "none" }}
      variant="contained"
      color="warning"
      onClick={onDelete}
    >
      Delete
    </Button>
  );
};
