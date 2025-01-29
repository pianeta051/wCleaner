import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthMd: {
          maxWidth: "100%",
        },
        maxWidthLg: {
          maxWidth: "100%",
        },
      },
    },
  },
});
