import { Box } from "@mui/material";
import styledComponents, { styled } from "styled-components";

export const AutocompleteWrap = styledComponents.div`
  width: 100%;
  min-width: 0;

  .MuiAutocomplete-root {
    width: 100%;
  }

  .MuiTextField-root {
    width: 100%;
  }

  .MuiOutlinedInput-root {
    min-height: 56px;
  }
`;

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
