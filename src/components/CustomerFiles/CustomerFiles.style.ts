import { styled, Box } from "@mui/material";
import styledComponents from "styled-components";
export const BoxField = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;
export const StyledImage = styledComponents.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  padding: 8px;
  background-color: #f9f9f9;
`;
