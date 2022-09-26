import { Grid, Paper, styled, TextField, Typography } from "@mui/material";

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const Subtitle = styled(Typography)(() => ({
  textAlign: "center",
}));

export const Wrapper = styled(Grid)(() => ({
  justifyContent: "center",
}));

export const FormPaper = styled(Paper)(() => ({
  padding: "10px",
}));

export const Field = styled(TextField)(() => ({
  marginBottom: "10px",
}));
