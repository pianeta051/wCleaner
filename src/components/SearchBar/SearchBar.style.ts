import {
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";

import { styled } from "@mui/material/styles";

export const SearchBox = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  minWidth: 0,
  height: 56,
  margin: 0,
  padding: 0,
}));

export const SearchControl = styled(FormControl)(() => ({
  width: "100%",
  height: 56,
  margin: 0,
  padding: 0,
}));

export const SearchInput = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  height: 56,

  margin: 0,

  borderRadius: +theme.shape.borderRadius * 2,

  backgroundColor: theme.palette.background.paper,

  fontSize: "1rem",

  "& .MuiOutlinedInput-input": {
    height: "auto",
    paddingTop: 0,
    paddingBottom: 0,
  },

  "& input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.text.secondary,
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
}));

export const SearchAdornment = styled(InputAdornment)(({ theme }) => ({
  marginRight: theme.spacing(0.75),

  color: theme.palette.text.secondary,
}));

export const SearchButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,

  padding: theme.spacing(0.5),

  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },
}));
