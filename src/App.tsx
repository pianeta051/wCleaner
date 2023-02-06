import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { FC } from "react";
import { theme } from "./theme";
import { AppRoutes } from "./components/AppRoutes/AppRoutes";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};
