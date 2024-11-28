import { Grid } from "@mui/material";
import { styled } from "@mui/system";

export const Wrapper = styled(Grid)(({ theme }) => ({
  // styles above the md breakpoint
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },

  padding: theme.spacing(0),
  marginTop: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "start",
}));
