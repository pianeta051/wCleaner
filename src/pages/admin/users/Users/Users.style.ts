import { Grid, Paper, styled, Typography } from "@mui/material";

export const UserBackground = styled(Paper)(() => ({
  padding: "10px",
  width: "98%",
}));

export const Wrapper = styled(Grid)(() => ({
  marginRight: "50px",
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "40px",
  textAlign: "center",
  width: "100%",
  marginTop: theme.spacing(1),

  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
    marginTop: theme.spacing(2),
  },
}));
