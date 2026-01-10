import {
  styled,
  Grid,
  Typography,
  List,
  Accordion,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",
  width: "100%",
  marginTop: theme.spacing(1),

  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
    marginTop: theme.spacing(2),
  },
}));

export const Wrapper = styled(Grid)(({ theme }) => ({
  margin: "0 auto",
  padding: theme.spacing(2),
  width: "100%",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
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

export const TopBarRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  alignItems: "center",
}));

export const OutcodeAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  "&:before": { display: "none" },
}));

export const AccordionTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const LoadingCenter = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export const DesktopOutcodeLoadingBox = styled(Grid)(({ theme }) => ({
  height: 56,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.default,
  alignItems: "center",
  justifyContent: "center",
}));

export const DesktopOutcodeBox = styled(Grid)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
}));

export const ActionsGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",

  [theme.breakpoints.down("sm")]: {
    justifyContent: "stretch",
  },
}));

export const NewCustomerButton = styled(Button)(({ theme }) => ({
  height: 56,
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontWeight: 700,
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
