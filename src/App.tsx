import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { FC } from "react";
import { theme } from "./theme";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { CustomersProvider } from "./components/CustomersProvider/CustomersProvider";

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CustomersProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CustomersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
