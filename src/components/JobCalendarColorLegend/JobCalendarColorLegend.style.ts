import { List, Paper } from "@mui/material";
import { styled } from "@mui/system";

export const Wrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
}));

export const LegendList = styled(List)(() => ({
  display: "flex",
  flexDirection: "column",
}));
