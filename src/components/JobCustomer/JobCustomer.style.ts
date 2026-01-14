import { styled, Card, Box, Typography } from "@mui/material";

export const Section = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
}));

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: +theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

export const CardHeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const CardTitle = styled(Typography)(() => ({
  fontWeight: 900,
}));
