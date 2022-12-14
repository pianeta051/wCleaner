import { Typography } from "@mui/material";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

export const AdminLayout: FC = () => (
  <div>
    {/* Esto debería ser un menú de navegación */}
    <Typography sx={{ minWidth: 100 }}>
      <Link to="customers">Customers</Link>
    </Typography>

    <Outlet />
  </div>
);
