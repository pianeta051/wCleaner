import { styled } from "@mui/material/styles";
import {
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  Popover,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

export const Bar = styled(Toolbar)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minHeight: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

export const Brand = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  letterSpacing: ".15rem",
  cursor: "pointer",
  userSelect: "none",
  color: "inherit",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const DesktopNav = styled("nav")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing(2.5),
  },
}));

export const BurgerButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

export const RightZone = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: {
    marginLeft: "auto",
  },
}));

export const Spacer = styled("div")(() => ({
  flex: 1,
}));

export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>(({ theme, $active }) => ({
  color: theme.palette.common.white,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  letterSpacing: "0.02em",
  paddingInline: theme.spacing(1.5),
  height: 42,
  borderRadius: 999,
  transition: "background-color 0.2s ease",
  ...($active
    ? {
        backgroundColor: "rgba(255,255,255,0.16)",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
      }
    : {
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
      }),
}));

export const UserButton = styled(IconButton)(() => ({
  width: 42,
  height: 42,
  color: "white",
  backgroundColor: "rgba(255,255,255,0.14)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
}));

export const MobileDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "min(86vw, 360px)",
    borderTopRightRadius: theme.shape.borderRadius * 2,
    borderBottomRightRadius: theme.shape.borderRadius * 2,
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",
    backgroundImage: "none",
  },
}));

export const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const DrawerBrand = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  lineHeight: 1.1,
  color: theme.palette.text.primary,
}));

export const DrawerClose = styled(IconButton)(({ theme }) => ({
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export const DrawerBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const DrawerFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const DrawerItemButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>(({ theme, $active }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25, 1.25),
  borderRadius: theme.shape.borderRadius * 2,
  cursor: "pointer",
  userSelect: "none",
  transition: "background-color 0.15s ease",

  ...($active
    ? { backgroundColor: theme.palette.action.selected }
    : {
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: theme.palette.action.hover },
      }),

  "&:active": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export const DrawerItemIcon = styled(Box)(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  backgroundColor: theme.palette.action.hover,
}));

export const DrawerItemText = styled(Box)(() => ({
  fontWeight: 800,
  fontSize: 14,
}));

export const UserPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    width: 320,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
    boxShadow: theme.shadows[8],
  },
}));

export const UserPopoverHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
}));

export const UserPopoverHeaderText = styled(Box)(() => ({
  minWidth: 0,
}));

export const UserPopoverTitle = styled(Typography)(() => ({
  fontWeight: 800,
  lineHeight: 1.1,
}));

export const UserPopoverEmailRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(0.5),
}));

export const UserPopoverEmailText = styled(Typography)(() => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const UserPopoverList = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export const UserActionButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
}));

export const UserActionIcon = styled(ListItemIcon)(() => ({
  minWidth: 36,
}));
