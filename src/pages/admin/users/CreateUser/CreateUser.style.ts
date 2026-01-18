import { Box, Container, styled, Typography } from "@mui/material";

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(5),
  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

export const FormWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));
