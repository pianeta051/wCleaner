import {
  styled,
  Breadcrumbs,
  Typography,
  Paper,
  Grid,
  Box,
  FormControl,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styledComponents from "styled-components";

export const Wrapper = styled(Grid)(({ theme }) => ({
  width: "100%",
  margin: "0 auto",

  [theme.breakpoints.up("md")]: {
    width: "80%",
  },
}));

export const SubHeaderBar = styled(Box)<{ $top: number }>(
  ({ theme, $top }) => ({
    position: "sticky",
    top: $top,
    zIndex: theme.zIndex.appBar,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    transform: "translateZ(0)",
    willChange: "transform",
    display: "flex",
  })
);

export const SubHeaderInner = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const SectionNav = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginLeft: "200px",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const SectionNavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active?: boolean }>(({ theme, $active }) => ({
  fontWeight: $active ? 800 : 600,
  textTransform: "none",
  minWidth: "auto",
  borderRadius: 0,

  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),

  color: $active ? theme.palette.primary.main : theme.palette.text.secondary,

  borderBottom: $active
    ? `3px solid ${theme.palette.primary.main}`
    : "3px solid transparent",

  transition: "all 150ms ease",

  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    borderBottom: `3px solid ${theme.palette.primary.main}`,
  },
}));

export const MobileSectionSelect = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(1),

  width: "80%",
  maxWidth: 520,
  marginLeft: 20,
  marginRight: "auto",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  boxSizing: "border-box",

  "& .MuiInputBase-root": {
    height: 56,
  },

  "& .MuiInputLabel-root": {
    top: -2,
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const BreadcrumbContainer = styledComponents.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

export const StyledBreadcrumbs = styled(Breadcrumbs)`
  & .MuiBreadcrumbs-separator {
    margin: 0 5px;
    color: #999;
    font-size: 1.2rem;
  }
`;

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

export const CurrentPage = styledComponents(Typography)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #333;
  font-size: 15px;
`;
