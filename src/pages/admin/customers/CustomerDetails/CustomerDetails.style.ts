import { styled, Stack, IconButton, Drawer, Paper, Grid } from "@mui/material";

export const Wrapper = styled(Grid)(() => ({
  margin: "auto",
  padding: 10,
  width: "100%",
}));

export const TopBar = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledDrawer = styled(Drawer)(() => ({
  "& .MuiPaper-root": {
    top: "64px",
    height: "calc(100% - 64px)",
  },
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));
