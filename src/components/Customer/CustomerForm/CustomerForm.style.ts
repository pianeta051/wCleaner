import { styled, Box, Grid, Paper, Typography, TextField } from "@mui/material";

export const ActionBar = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  boxShadow: theme.shadows[3],
  zIndex: 1200,
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));
export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Grid)<{ enableScroll?: boolean }>(
  ({ enableScroll }) => ({
    width: "100%",
    height: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    overflowY: enableScroll ? "scroll" : undefined,
    maxHeight: enableScroll ? "700px" : undefined,
    paddingLeft: "20px",
  })
);

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)({
  backgroundColor: "#fff",

  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "10px",
  width: "70%",
});

export const Field = styled(TextField)(() => ({
  marginBottom: "10px",
  width: "90%",
  marginLeft: "40px",
}));
