import { FC } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ForgotMyPassword } from "../pages/authentication/ForgotMyPassword/ForgotMyPassword";
import { Login } from "../pages/authentication/Login/Login";
import { ResetPassword } from "../pages/authentication/ResetPassword/ResetPassword";
import { NotFound } from "../pages/NotFound/NotFound";
import { AdminLayout } from "../components/AdminLayout/AdminLayout";
import { Customers } from "../pages/admin/customers/Customers/Customers";
import { SetPassword } from "../pages/authentication/SetPassword/SetPassword";
import { UsersPage } from "../pages/admin/users/Users/Users";
import { ProfilePage } from "../pages/admin/users/Profile/Profile";
import { CreateUserPage } from "../pages/admin/users/CreateUser/CreateUser";
import { CustomerDetails } from "../pages/admin/customers/CustomerDetails/CustomerDetails";
import { UnAuthenticatedRoute } from "./UnAuthenticateRoute";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import { AdminRoute } from "./AdminRoute";
import { DashboardLayout } from "../components/DashboardLayout/DashboardLayout";
import { JobsPage } from "../pages/admin/Jobs/Jobs";

import { JobDetailsPage } from "../pages/admin/JobDetails/JobDetails";

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route
        element={
          <UnAuthenticatedRoute>
            <Outlet />
          </UnAuthenticatedRoute>
        }
      >
        <Route index element={<Navigate to="/log-in" />} />
        <Route path="log-in" element={<Login />} />
        <Route path="forgot-password" element={<ForgotMyPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="set-password" element={<SetPassword />} />
      </Route>

      <Route
        path="admin"
        element={
          <AuthenticatedRoute>
            <AdminLayout />
          </AuthenticatedRoute>
        }
      >
        <Route index element={<Navigate to="customers" />} />
        <Route path="customers">
          <Route index element={<Customers />} />
          <Route path=":slug" element={<CustomerDetails />} />
        </Route>

        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="users"
          element={
            <AdminRoute>
              <Outlet />
            </AdminRoute>
          }
        >
          <Route index element={<UsersPage />} />
          <Route path="create" element={<CreateUserPage />} />
        </Route>

        <Route
          path="jobs"
          element={
            <AuthenticatedRoute>
              <DashboardLayout />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<JobsPage />} />

          <Route path=":jobId">
            <Route index element={<JobDetailsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
