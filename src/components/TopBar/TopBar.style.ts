import { Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import { styled } from "@mui/system";

export const Bar = styled(Toolbar)(() => ({
  display: "flex",
  justifyContent: "space-between",
  position: "fixed",
}));

export const Logo = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "none",
  fontFamily: "monospace",
  fontWeight: 700,
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  letterSpacing: ".3rem",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export const MenuButton = styled(Button)(({ theme }) => ({
  color: "white",
  display: "block",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
