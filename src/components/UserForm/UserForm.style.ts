import { styled, Box, Card, Button } from "@mui/material";

export const FormContainer = styled(Box)(({ theme }) => ({
  width: "min(395px, 89vw)",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  boxSizing: "border-box",
  overflowX: "hidden",

  [theme.breakpoints.down("sm")]: {
    width: "min(395px, 89vw)",
    padding: theme.spacing(1.5),
  },
}));

export const ColorCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
}));

export const ColorPreview = styled("div")(() => ({
  height: 50,
}));

export const ColorPickerWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  overflowX: "auto",
  paddingBottom: theme.spacing(1),

  display: "flex",
  justifyContent: "center",

  WebkitOverflowScrolling: "touch",

  "& > div": {
    minWidth: 260,
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  height: 44,
}));
