import { styled, Box } from "@mui/material";

export const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    overflowY: "auto",
    maxHeight: "100%",
  },
}));
