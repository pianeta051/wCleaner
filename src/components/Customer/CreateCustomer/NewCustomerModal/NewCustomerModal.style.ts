import { styled, Box } from "@mui/material";

export const Overlay = styled(Box)(() => ({
  position: "fixed",
  inset: 0,

  backgroundColor: "rgba(0,0,0,0.45)",

  display: "flex",
  alignItems: "stretch",
  justifyContent: "stretch",

  width: "100%",
  height: "100dvh",

  overflow: "hidden",
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  position: "relative",

  width: "100%",
  height: "100dvh",
  maxHeight: "100dvh",

  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  boxShadow: theme.shadows[24],

  display: "flex",
  flexDirection: "column",

  overflow: "hidden",

  minHeight: 0,

  [theme.breakpoints.up("sm")]: {
    width: "min(760px, 96vw)",
    height: "min(92dvh, 900px)",
    maxHeight: "92dvh",

    borderRadius: +theme.shape.borderRadius * 2,
    margin: "auto",
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  flexShrink: 0,

  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),

  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const HeaderText = styled(Box)(() => ({
  minWidth: 0,
}));

export const Content = styled(Box)(({ theme }) => ({
  flex: "1 1 auto",

  minHeight: 0,
  minWidth: 0,

  overflowY: "auto",
  overflowX: "hidden",

  WebkitOverflowScrolling: "touch",

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
  flexShrink: 0,

  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,

  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),

  paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom))`,

  display: "flex",
  gap: theme.spacing(1.5),
  justifyContent: "flex-end",

  zIndex: 1,

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",

    "& > *": {
      flex: 1,
      minWidth: 0,
    },
  },
}));
