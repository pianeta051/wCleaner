import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FiltersWrapper = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FiltersStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  alignItems: "stretch",
  flexWrap: "wrap",
  rowGap: theme.spacing(2),
  columnGap: theme.spacing(2),

  [theme.breakpoints.up("lg")]: {
    alignItems: "center",
  },
}));

export const ClearButton = styled(Button)({
  whiteSpace: "nowrap",
});
