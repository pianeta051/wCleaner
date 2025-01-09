import { Paper } from "@mui/material";
import { styled } from "@mui/system";
import { Container } from "@mui/material";

export const Wrapper = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
  },

  padding: theme.spacing(0.5),
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "start",
}));

export const CustomContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0),
  },
}));
