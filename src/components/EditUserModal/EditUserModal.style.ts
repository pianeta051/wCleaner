import { Box, Grid, styled } from "@mui/material";

export const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,

  maxWidth: "80vw",
  maxHeight: "100%",
  position: "fixed",
  top: "50%",
  left: "30%",
  transform: "translate(0, -50%)",
  overflowY: "auto",
  marginRight: "50px",

  padding: "20px",
}));

export const Wrapper = styled(Grid)(() => ({
  width: "100%",
  height: "100%",
  paddingTop: "10px",
  paddingBottom: "10px",
}));
