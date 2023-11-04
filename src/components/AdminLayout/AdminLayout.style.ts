import { Grid } from "@mui/material";
import { styled } from "@mui/system";

export const Wrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "start",
}));
