import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { FC } from "react";
import { theme } from "./theme";
import { AppRoutes } from "./components/AppRoutes/AppRoutes";

// type LoginProps = {
//   elements: LoginForm[];
// };

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};
