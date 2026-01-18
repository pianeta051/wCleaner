import { Box, Divider, Paper, Typography, styled } from "@mui/material";
export const PageWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  boxSizing: "border-box",
  overflowX: "hidden",
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(5),
  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",
  width: "100%",
  marginBottom: theme.spacing(2),
}));

export const ProfileContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  boxSizing: "border-box",
}));

export const ProfileCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 2,

  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const Line = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));
