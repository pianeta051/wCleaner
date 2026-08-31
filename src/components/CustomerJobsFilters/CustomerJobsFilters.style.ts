import { Button, FormControl, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import { DateField } from "../JobForm/JobForm.style";

export const FiltersWrapper = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FiltersStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  flexWrap: "wrap",
  gap: theme.spacing(2),

  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

export const DateFilterField = styled(DateField)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: 180,
  },
}));

export const PriceTextField = styled(TextField)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: 150,
  },
}));

export const AssignedToFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: 250,
  },

  [theme.breakpoints.up("md")]: {
    width: 220,
  },
}));

export const JobTypeFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: 220,
  },
}));

export const AddressFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: 240,
  },
}));

export const ClearButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: 40,
  whiteSpace: "nowrap",
  alignSelf: "stretch",

  [theme.breakpoints.up("lg")]: {
    width: "auto",
    alignSelf: "center",
  },
}));
