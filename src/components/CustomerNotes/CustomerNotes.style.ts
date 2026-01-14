import { styled, Box, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";

export const NotesSection = styled(Box)(({ theme }) => ({
  width: "97%",
  marginLeft: "20px",
  boxSizing: "border-box",
  marginTop: theme.spacing(1),
}));
export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(() => ({
  fontWeight: 800,
}));

export const NotesContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "scrollable",
})<{ scrollable?: boolean }>(({ theme, scrollable }) => ({
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: +theme.shape.borderRadius * 2,
  overflowY: scrollable ? "auto" : "visible",
  maxHeight: scrollable ? 400 : "none",
}));

export const NoteAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,

  "&:before": {
    display: "none",
  },

  "&:last-of-type": {
    borderBottom: "none",
  },
}));
