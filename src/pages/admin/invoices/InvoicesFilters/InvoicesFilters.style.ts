import { Box, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FiltersWrapper = styled(Box)`
  display: flex;
  justify-content: flex-start;
`;

export const FiltersStack = styled(Stack)`
  align-items: flex-start;
`;

export const ClearButton = styled(Button)`
  white-space: nowrap;
  min-width: fit-content;
`;

export const datePickerTextFieldSx = {
  width: 160,
};
