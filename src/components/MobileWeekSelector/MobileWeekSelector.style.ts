import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const WeekSelectorContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  width: "100%",
  gap: theme.spacing(0.5),
  padding: theme.spacing(2, 1),
  backgroundColor: theme.palette.background.paper,
}));

export const WeekDayButton = styled("button")<{ selected: boolean }>(
  ({ theme, selected }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 0),
    border: "none",
    background: "transparent",
    cursor: "pointer",
    minWidth: 0,

    "& .day-number": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 42,
      height: 42,
      borderRadius: "50%",
      backgroundColor: selected ? theme.palette.primary.main : "transparent",
      color: selected
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
      fontWeight: selected ? 700 : 500,
      fontSize: "1.1rem",
    },

    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
      borderRadius: theme.shape.borderRadius,
    },
  })
);

export const WeekDayLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));
