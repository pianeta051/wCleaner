import { styled, Box } from "@mui/material";

export const ModalBox = styled(Box)({
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  minHeight: "25vh",
});

export const SkeletonWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    minWidth: "550px",
  },
}));
