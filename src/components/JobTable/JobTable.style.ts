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

export const JobCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "$selected",
})<{ $selected?: boolean }>(({ theme, $selected }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  transition: "transform 120ms ease, box-shadow 120ms ease",
  ...(!!$selected && {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  }),
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));

export const JobCardLink = styled(RouterLink)(({ theme }) => ({
  display: "block",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const CardActionsSx = {
  sx: {
    px: 2,
    pb: 2,
    pt: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
};

export const LinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};
