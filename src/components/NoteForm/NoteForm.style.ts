import { styled } from "@mui/material/styles";
import { Box, TextField } from "@mui/material";

export const FormWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",

  // Mobile: ocupa todo el ancho disponible
  [theme.breakpoints.up("md")]: {
    maxWidth: "80%", // 👈 AQUÍ controlas el ancho
  },
}));

const commonFieldStyle = {
  width: "100%",
};

export const Field = styled(TextField)(({ theme }) => ({
  ...commonFieldStyle,

  "& .MuiInputBase-root": {
    borderRadius: +theme.shape.borderRadius * 2,
  },
}));

export const MultilineField = styled(TextField)(({ theme }) => ({
  ...commonFieldStyle,

  "& .MuiInputBase-root": {
    borderRadius: +theme.shape.borderRadius * 2,
  },
}));
