import {
  styled,
  Grid,
  Typography,
  List,
  Accordion,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";

export const Wrapper = styled(Grid)(({ theme }) => ({
  margin: "0 auto",
  padding: theme.spacing(2),
  width: "100%",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",
  width: "100%",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
    marginTop: theme.spacing(2),
  },
}));
