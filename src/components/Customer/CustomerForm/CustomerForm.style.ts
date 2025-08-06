import { styled, Box, Grid, Paper, Typography, TextField } from "@mui/material";

export const Background = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Wrapper = styled(Grid)<{ enableScroll?: boolean }>(
  ({ enableScroll }) => ({
    width: "100%",
    height: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    overflowY: enableScroll ? "scroll" : undefined,
    maxHeight: enableScroll ? "700px" : undefined,
    paddingLeft: "20px",
  })
);

export const Title = styled(Typography)(() => ({
  textAlign: "center",
}));

export const ModalBox = styled(Box)({
  backgroundColor: "#fff",

  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "10px",
  width: "70%",
});

export const Field = styled(TextField)(() => ({
  marginBottom: "10px",
  width: "90%",
  marginLeft: "40px",
}));
