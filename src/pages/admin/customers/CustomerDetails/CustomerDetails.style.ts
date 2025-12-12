import {
  styled,
  Breadcrumbs,
  Typography,
  Stack,
  IconButton,
  Drawer,
  Paper,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import styledComponents from "styled-components";

export const Wrapper = styled(Grid)(() => ({
  margin: "auto",
  padding: 10,
  width: "100%",
}));

export const TopBar = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledDrawer = styled(Drawer)(() => ({
  "& .MuiPaper-root": {
    top: "64px",
    height: "calc(100% - 64px)",
  },
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const BreadcrumbContainer = styledComponents.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  width: fit-content;
  
   @media (max-width: 600px) {
    margin-top: 50px;
  }
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
