import { DataGrid } from "@mui/x-data-grid";
import styledComponents from "styled-components";
import { styled } from "@mui/material";

type WrapperProps = {
  elements: number;
};

export const Wrapper = styledComponents.div<WrapperProps>(({ elements }) => ({
  height: `${52 * elements + 111}px`,
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
