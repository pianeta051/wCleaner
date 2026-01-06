import { styled } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const commonFieldStyle = {
  marginBottom: "10px",
  width: "100%",
};

export const DateField = styled(DatePicker)(() => ({
  ...commonFieldStyle,
}));

export const TimeField = styled(TimePicker)(() => ({
  ...commonFieldStyle,
}));

export const Field = styled(TextField)(() => ({
  ...commonFieldStyle,
}));

export const ImagePreviewWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));
export const PreviewImage = styled("img")(({ theme }) => ({
  width: 60,
  height: 60,
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #ccc",
}));
