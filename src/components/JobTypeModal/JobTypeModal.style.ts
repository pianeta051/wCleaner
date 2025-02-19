import { styled, Box, Grid, Paper, Typography, TextField } from "@mui/material";

export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "100%",
  height: "100%",
  paddingTop: "10px",
  paddingBottom: "10px",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  borderRadius: "10px",
  [theme.breakpoints.down("md")]: {
    width: "80%",
  },
}));
