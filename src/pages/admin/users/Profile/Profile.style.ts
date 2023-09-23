import { Divider } from "@mui/material";
import { styled } from "@mui/system";

export const Line = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
