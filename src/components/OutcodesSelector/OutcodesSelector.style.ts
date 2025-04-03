import { Box } from "@mui/material";
import styledComponents, { styled } from "styled-components";

export const AutocompleteWrap = styledComponents.div({
  width: 200,
  marginBottom: 2,
});

export const CheckBoxWrap = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: 400,
  alignItems: "flex-start",
}));

export const OutcodeBox = styled(Box)(() => ({
  width: "50%",
  display: "flex",
  justifyContent: "flex-start",
}));
