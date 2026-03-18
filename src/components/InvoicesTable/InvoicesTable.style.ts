// import { Card, TableCell } from "@mui/material";
// import { styled } from "@mui/material/styles";

// export const InvoiceCard = styled(Card)(({ theme }) => ({
//   borderRadius: theme.spacing(2),
//   overflow: "hidden",
//   border: `1px solid ${theme.palette.divider}`,
//   boxShadow: "none",
//   transition: "transform 120ms ease, box-shadow 120ms ease",
//   "&:hover": {
//     transform: "translateY(-1px)",
//     boxShadow: theme.shadows[2],
//   },
// }));

// export const InvoiceCardActions = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(2),
//   paddingTop: theme.spacing(0),
//   display: "flex",
//   justifyContent: "space-between",
//   gap: theme.spacing(1),
// }));

// export const InvoiceNumberCell = styled(TableCell)(({ theme }) => ({
//   width: "60px",
// }));
import { Box, Card, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const InvoiceCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  transition: "transform 120ms ease, box-shadow 120ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));

export const InvoiceCardActions = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(0),
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
}));

export const InvoiceNumberCell = styled(TableCell)(() => ({
  width: 120,
  fontWeight: 700,
  whiteSpace: "nowrap",
}));

export const AddressCellContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
  minWidth: 220,
}));
