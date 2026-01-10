import { Card, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

type WrapperProps = {
  elements: number;
  isMobile?: boolean;
};

export const Wrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "elements" && prop !== "isMobile",
})<WrapperProps>(({ elements, isMobile }) => ({
  height: isMobile ? "auto" : `${52 * elements + 111}px`,
}));

export const AdminManagementContainer = styled(Box)(() => ({
  width: 200,
  display: "flex",
  justifyContent: "flex-end",
}));

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .user-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
}));

export const UserCard = styled(Card)(({ theme }) => ({
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
