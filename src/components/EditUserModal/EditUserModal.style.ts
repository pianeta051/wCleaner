import { styled, Box, Grid, Typography, Paper } from "@mui/material";

export const ModalViewport = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  background: "transparent",
  cursor: "pointer",

  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    padding: theme.spacing(1.5),
  },
}));

export const ModalContent = styled(Paper)(({ theme }) => ({
  cursor: "default",
  width: "min(520px, 96vw)",
  borderRadius: +theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: theme.shadows[8],

  maxHeight: "min(90vh, 900px)",
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxHeight: "calc(100vh - 24px)",
  },
}));

export const Wrapper = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const Title = styled(Typography)(() => ({
  fontWeight: 900,
  textAlign: "center",
}));

export const Background = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(2),

  overflowY: "auto",
}));
