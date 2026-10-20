import { styled } from "@mui/material/styles";
import { Box, Button, FormControl, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const FiltersWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(3),
}));

export const FiltersStack = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: theme.spacing(2),
  alignItems: "center",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

export const DateFilterField = styled(DatePicker)({
  width: "100%",
  minWidth: 0,
});

export const PriceTextField = styled(TextField)({
  width: "100%",
  minWidth: 0,
});

export const AssignedToFormControl = styled(FormControl)({
  width: "100%",
  minWidth: 0,
});

export const JobTypeFormControl = styled(FormControl)({
  width: "100%",
  minWidth: 0,
});

export const AddressFormControl = styled(FormControl)({
  width: "100%",
  minWidth: 0,
});

export const ClearButton = styled(Button)(({ theme }) => ({
  justifySelf: "start",
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
