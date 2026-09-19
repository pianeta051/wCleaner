import { Card, Chip, TableCell } from "@mui/material";

import { styled } from "@mui/material/styles";

import { Link as RouterLink } from "react-router-dom";

import { JobStatus } from "../../types/types";

export const TableCellWrap = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,

  fontWeight: 800,

  position: "sticky",
  top: 0,
  zIndex: 2,

  borderBottom: `1px solid ${theme.palette.primary.dark}`,

  whiteSpace: "nowrap",
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

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$status",
})<{ $status: JobStatus }>(({ theme, $status }) => {
  const styles = {
    pending: {
      color: "#9A6700",
      backgroundColor: "#FFF4D6",
      borderColor: "#F5C451",
    },

    completed: {
      color: "#1B5E20",
      backgroundColor: "#E8F5E9",
      borderColor: "#81C784",
    },

    cancelled: {
      color: "#B71C1C",
      backgroundColor: "#FFEBEE",
      borderColor: "#EF9A9A",
    },
  };

  const statusStyle = styles[$status];

  return {
    height: 28,

    fontWeight: 700,
    fontSize: "0.75rem",

    border: "1px solid",

    color: statusStyle.color,
    backgroundColor: statusStyle.backgroundColor,
    borderColor: statusStyle.borderColor,

    "& .MuiChip-label": {
      paddingLeft: theme.spacing(1.25),
      paddingRight: theme.spacing(1.25),
    },
  };
});

export const PaymentChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$empty",
})<{ $empty?: boolean }>(({ theme, $empty }) => ({
  height: 28,

  fontWeight: 600,
  fontSize: "0.75rem",

  border: "1px solid",

  color: $empty ? theme.palette.text.secondary : theme.palette.primary.dark,

  backgroundColor: $empty
    ? theme.palette.action.hover
    : theme.palette.primary.main + "12",

  borderColor: $empty
    ? theme.palette.divider
    : theme.palette.primary.main + "55",

  "& .MuiChip-label": {
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
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
