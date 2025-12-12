import { styled, Box, Grid, Paper, Typography, TextField } from "@mui/material";

export const ActionBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: "sticky" | "inline" }>(({ theme, variant = "inline" }) => ({
  display: "flex",
  gap: theme.spacing(1.5),

  ...(variant === "sticky"
    ? {
        position: "sticky",
        bottom: 0,
        zIndex: 2,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
        boxShadow: theme.shadows[4],
        justifyContent: "flex-end",
      }
    : {
        paddingTop: theme.spacing(2),
        justifyContent: "flex-end",
      }),

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    "& > *": {
      flex: 1,
      minWidth: 0,
    },
  },
}));

export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Grid)<{ enableScroll?: boolean }>(
  ({ theme, enableScroll }) => ({
    width: "100%",
    margin: 0,
    padding: theme.spacing(2),
    boxSizing: "border-box",
    overflowX: "hidden",

    overflowY: enableScroll ? "auto" : "visible",
    maxHeight: enableScroll ? "calc(100vh - 200px)" : "none",

    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(3),
    },
  })
);

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: theme.shape.borderRadius * 2,
  width: "min(720px, 92vw)",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: theme.shadows[8],
}));

export const Field = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-root": {
    borderRadius: theme.shape.borderRadius * 2,
  },
}));
