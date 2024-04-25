import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { FC } from "react";
import { theme } from "./theme";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { CustomersProvider } from "./components/CustomersProvider/CustomersProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const App: FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CustomersProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CustomersProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};
