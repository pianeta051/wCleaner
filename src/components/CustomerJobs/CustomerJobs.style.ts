import { styled, Grid, Typography, List } from "@mui/material";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";

export const IconButton = styledComponents.div`
  float: right;
  margin-top: 20px;
  margin-right: 20px;
`;
export const MenuFilterJob = styled(Grid)(() => ({
  margin: "auto",
  padding: "10px",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
}));

export const Title = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "40px",
}));
export const Wrapper = styled(Grid)(() => ({
  margin: "auto",
  padding: "10px",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
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
