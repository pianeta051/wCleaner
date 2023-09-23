import { Grid, styled, Paper, Typography } from "@mui/material";

export const Background = styled(Grid)(() => ({
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#F0F2F5",
}));

export const FormPaper = styled(Paper)(() => ({
  padding: "10px",
}));

export const Subtitle = styled(Typography)(() => ({
  textAlign: "center",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const Wrapper = styled(Grid)(() => ({
  justifyContent: "center",
}));
