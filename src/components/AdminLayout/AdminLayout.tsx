import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

export const AdminLayout: FC = () => (
  <div>
    {/* Esto debería ser un menú de navegación */}
    <Link to="customers">Customers</Link>
    <Outlet />
  </div>
);
