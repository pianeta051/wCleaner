import { TableCell, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TableCellWrap = styled(TableCell)(() => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  fontWeight: "bold",
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

export const CustomerCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
