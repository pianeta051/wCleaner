import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ForgotMyPassword } from "../../pages/authentication/ForgotMyPassword/ForgotMyPassword";
import { Login } from "../../pages/authentication/Login/Login";
import { ResetPassword } from "../../pages/authentication/ResetPassword/ResetPassword";
import { NotFound } from "../../pages/NotFound/NotFound";
import { AdminLayout } from "../AdminLayout/AdminLayout";
import { Customers } from "../../pages/admin/customers/Customers/Customers";
import { SetPassword } from "../../pages/authentication/SetPassword/SetPassword";
import { UsersPage } from "../../pages/admin/users/Users/Users";
import { ProfilePage } from "../../pages/admin/users/Profile/Profile";
import { CreateUserPage } from "../../pages/admin/users/CreateUser/CreateUser";
import { CustomerDetails } from "../../pages/admin/customers/CustomerDetails/CustomerDetails";

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route>
        <Route index element={<Navigate to="/log-in" />} />
        <Route path="log-in" element={<Login />} />
        <Route path="forgot-password" element={<ForgotMyPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="set-password" element={<SetPassword />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="customers" />} />
          <Route path="customers">
            <Route index element={<Customers />} />
            <Route path=":url" element={<CustomerDetails />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersPage />} />
            <Route path="create" element={<CreateUserPage />} />
            <Route path="me" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
