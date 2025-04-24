// JobForm.style.ts
import { styled } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// Shared style for all form fields
const commonFieldStyle = {
  marginBottom: "10px",
  width: "100%",
};

// Styled Date Picker
export const DateField = styled(DatePicker)(() => ({
  ...commonFieldStyle,
}));

// Styled Time Picker
export const TimeField = styled(TimePicker)(() => ({
  ...commonFieldStyle,
}));

// Styled TextField (for price)
export const Field = styled(TextField)(() => ({
  ...commonFieldStyle,
}));

// Wrapper around ImagePicker and preview image
export const ImagePreviewWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

// Styled image preview next to ImagePicker
export const PreviewImage = styled("img")(({ theme }) => ({
  width: 60,
  height: 60,
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #ccc",
}));
