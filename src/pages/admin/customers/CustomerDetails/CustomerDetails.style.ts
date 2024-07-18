import { styled, Grid, Typography, Button } from "@mui/material";

export const Background = styled(Grid)(() => ({
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#F0F2F5",
}));
export const CustomerAttribute = styled(Typography)(() => ({
  fontSize: "14px",
  marginBottom: "20px",
}));
export const ButtonEdit = styled(Button)(() => ({
  float: "right",
  marginTop: "20px",
  marginRight: "20px",
}));

export const SubTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "14px",
}));

export const Title = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
}));
export const Wrapper = styled(Grid)(() => ({
  margin: "auto",
  padding: "10px",
  width: "100%",
  alignContent: "center",
}));
export const DividerLine = styled(Grid)(() => ({
  p: 0,
  width: "100%",
  maxWidth: 360,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
  marginBottom: "10px",
  marginTop: "10px",
}));
