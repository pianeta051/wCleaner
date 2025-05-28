import { styled, Box, Paper, Grid, Typography } from "@mui/material";

export const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: theme.shadows[5],
  [theme.breakpoints.down("md")]: {
    width: "100%",
    overflowY: "auto",
    maxHeight: "100%",
  },
}));

export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "100%",
  paddingTop: "10px",
  paddingBottom: "10px",
}));

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));
