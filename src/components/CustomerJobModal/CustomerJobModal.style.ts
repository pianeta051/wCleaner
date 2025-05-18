import { styled } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";

export const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "#fff",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  boxShadow: theme.shadows[5],

  [theme.breakpoints.up("sm")]: {
    width: "600px",
    padding: theme.spacing(4),
  },
}));

export const Wrapper = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const Background = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: "center",
  fontWeight: 600,
}));
