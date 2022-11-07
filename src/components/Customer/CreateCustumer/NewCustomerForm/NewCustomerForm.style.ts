import { Grid, Paper, styled, TextField, Typography } from "@mui/material";

export const Background = styled(Paper)(() => ({
  backgroundColor: "#F0F2F5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "80%",
  height: "80%",
}));

export const Field = styled(TextField)(() => ({
  marginBottom: "10px",
}));
