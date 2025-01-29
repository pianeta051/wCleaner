import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const CalendarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));
