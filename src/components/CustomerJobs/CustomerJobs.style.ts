import { styled, Grid, Typography, List, Box } from "@mui/material";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    justifyContent: "stretch",
  },
}));

export const MenuFilterJob = styled(Grid)(() => ({
  margin: "auto",
  padding: "10px",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
}));

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
