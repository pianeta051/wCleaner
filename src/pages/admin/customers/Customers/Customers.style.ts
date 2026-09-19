import {
  styled,
  Box,
  Grid,
  Typography,
  List,
  Accordion,
  Button,
} from "@mui/material";

import { Link } from "react-router-dom";
import styledComponents from "styled-components";

export const Wrapper = styled(Grid)(({ theme }) => ({
  margin: "0 auto",
  padding: theme.spacing(2),

  width: "100%",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  width: "100%",

  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",

  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",

    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export const TopBarRow = styled(Box)(({ theme }) => ({
  width: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",

  gap: theme.spacing(2),

  marginBottom: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",

    gap: theme.spacing(1.5),

    marginBottom: theme.spacing(2),
  },
}));

export const DesktopOutcodeBox = styled(Box)(() => ({
  flex: "0 0 260px",

  width: 260,
  height: 56,

  display: "flex",
  alignItems: "center",

  margin: 0,
  padding: 0,

  "& > *": {
    width: "100%",
  },
}));

export const DesktopOutcodeLoadingBox = styled(Box)(({ theme }) => ({
  flex: "0 0 260px",

  width: 260,
  height: 56,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxSizing: "border-box",

  border: `1px solid ${theme.palette.divider}`,

  borderRadius: +theme.shape.borderRadius * 2,
}));

export const SearchArea = styled(Box)(({ theme }) => ({
  flex: "0 1 600px",

  width: 600,
  maxWidth: 600,
  minWidth: 320,

  height: 56,

  display: "flex",
  alignItems: "center",

  margin: 0,
  padding: 0,

  "& > *": {
    width: "100%",
    margin: 0,
  },

  "& form": {
    width: "100%",
    height: 56,

    margin: 0,
    padding: 0,

    display: "flex",
    alignItems: "center",
  },

  [theme.breakpoints.down("md")]: {
    flex: "1 1 400px",

    width: "auto",
    maxWidth: "none",

    minWidth: 250,
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "none",
    minWidth: 0,

    flex: "none",
  },
}));

export const ActionsGrid = styled(Box)(() => ({
  flex: "0 0 auto",

  height: 56,

  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",

  margin: 0,
  padding: 0,
}));

export const NewCustomerButton = styled(Button)(({ theme }) => ({
  height: 56,

  minWidth: 165,

  margin: 0,

  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),

  borderRadius: +theme.shape.borderRadius * 2,

  textTransform: "none",

  fontWeight: 700,

  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const OutcodeAccordion = styled(Accordion)(({ theme }) => ({
  width: "100%",

  margin: 0,

  border: `1px solid ${theme.palette.divider}`,

  borderRadius: +theme.shape.borderRadius * 2,

  boxShadow: "none",

  "&:before": {
    display: "none",
  },

  "&.Mui-expanded": {
    margin: 0,
  },
}));

export const AccordionTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const LoadingCenter = styled(Grid)(({ theme }) => ({
  justifyContent: "center",

  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export const ListCustomers = styled(List)(() => ({
  width: "120px",
  margin: "auto",
}));

export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;

  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

export const LeftGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    borderRight: "1px solid #ddd",
  },
}));

export const OutcodeGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    borderRight: "1px solid #ddd",
  },

  [theme.breakpoints.up("md")]: {
    marginTop: "180px",
  },
}));
export const TableHead = styledComponents.th`
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
`;

export const TableBody = styledComponents.tbody`
  background-color: #e4f0f5;
`;

export const Table = styledComponents.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
`;

export const TableData = styledComponents.td`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
`;
