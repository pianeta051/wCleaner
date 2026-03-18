import styled from "styled-components";
import { Box, Button } from "@mui/material";

export const FullScreenWrapper = styled(Box)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: white;
  z-index: 9999;
`;

export const TopBar = styled(Box)`
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: white;
  border-bottom: 1px solid #ddd;
`;

export const PdfContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

export const ButtonDownload = styled(Button)`
  text-decoration: none;
`;

export const CloseButton = styled(Button)`
  text-decoration: none;
`;
