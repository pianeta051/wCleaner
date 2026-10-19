import { FC } from "react";
import { getCleaningDueInfo } from "../../utils/cleaningDue";
import { Chip } from "@mui/material";

type AddressDueDateChipProps = {
  dueDate?: string;
};

export const AddressDueDateChip: FC<AddressDueDateChipProps> = ({
  dueDate,
}) => {
  const dueInfo = getCleaningDueInfo(dueDate);

  if (!dueInfo) {
    return null;
  }

  return (
    <Chip
      label={dueInfo.label}
      size="small"
      color={
        dueInfo.status === "overdue"
          ? "error"
          : dueInfo.status === "dueSoon"
          ? "warning"
          : "default"
      }
      variant={dueInfo.status === "normal" ? "outlined" : "filled"}
      sx={{ ml: 1 }}
    />
  );
};
