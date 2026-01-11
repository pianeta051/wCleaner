import { styled, Box, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styledComponents from "styled-components";

export const BreadcrumbsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$top",
})<{ $top: number }>(({ $top }) => ({
  position: "sticky",
  top: $top,
  zIndex: 1200,
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "12px 16px",
  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",

  transform: "translateZ(0)",
  willChange: "transform",
}));

export const StyledBreadcrumbs = styled(Breadcrumbs)(() => ({
  "& .MuiBreadcrumbs-separator": {
    margin: "0 8px",
    color: "#999",
    fontSize: "1.2rem",
  },
}));

export const BreadcrumbLink = styledComponents(RouterLink)`
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-weight: 500;
  color: #1976d2;
  font-size: 15px;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #1565c0;
  }
`;

export const CurrentPageText = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 600,
  color: "#333",
  fontSize: "15px",
}));
