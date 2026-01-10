import { Card, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
export const TableCellWrap = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 800,
  position: "sticky",
  top: 0,
  zIndex: 2,
  borderBottom: `1px solid ${theme.palette.primary.dark}`,
}));

export const CustomerCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  transition: "transform 120ms ease, box-shadow 120ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));

export const CustomerCardLink = styled(RouterLink)(({ theme }) => ({
  display: "block",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const CustomerCardActionsSx = {
  sx: {
    px: 2,
    pb: 2,
    pt: 0,
    display: "flex",
    justifyContent: "space-between",
    gap: 1,
  },
};

export const LinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};
