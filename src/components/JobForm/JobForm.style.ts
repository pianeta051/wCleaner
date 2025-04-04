import { styled, Box, Grid, Paper, Typography, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "100%",
  height: "100%",
  paddingTop: "10px",
  paddingBottom: "10px",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },

  transform: "translate(-50%, -50%)",
  borderRadius: "300px",
}));

export const Field = styled(TextField)(() => ({
  marginBottom: "10px",
  width: "94%",
  marginLeft: "20px",
}));

export const DateField = styled(DatePicker)(() => ({
  marginBottom: "10px",
  width: "94%",
  marginLeft: "20px",
}));
export const TimeField = styled(TimePicker)(() => ({
  marginBottom: "100px",
  width: "94%",
  marginLeft: "20px",
}));
