import { Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

export const Background = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: theme.spacing(37),
  [theme.breakpoints.up("sm")]: {
    maxWidth: theme.spacing(62),
  },
}));
