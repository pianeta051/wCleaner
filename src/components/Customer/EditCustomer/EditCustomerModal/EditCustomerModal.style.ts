import { styled, Box, Grid, Paper, Typography } from "@mui/material";

export const Background = styled(Paper)(() => ({
  backgroundColor: "#F0F2F5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "80%",
  height: "80%",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "20px",
});
