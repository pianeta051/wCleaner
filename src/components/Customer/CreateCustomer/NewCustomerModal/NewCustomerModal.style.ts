import { styled, Box } from "@mui/material";

export const Overlay = styled(Box)(() => ({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "stretch",
  overflow: "hidden",
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100vw",
  height: "100vh",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  boxShadow: theme.shadows[24],
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.up("sm")]: {
    width: "min(760px, 96vw)",
    height: "min(92vh, 900px)",
    borderRadius: theme.shape.borderRadius * 2,
    margin: "auto",
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  flexShrink: 0,

  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const HeaderText = styled(Box)(() => ({
  minWidth: 0,
}));

export const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: theme.palette.background.default,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),

  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export const ErrorWrap = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1.5),

  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export const Footer = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(1.5),
  justifyContent: "flex-end",

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    "& > *": {
      flex: 1,
      minWidth: 0,
    },
  },
}));
