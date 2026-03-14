import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp/VerifyOtp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "home",
        element: <Dashboard />,
      },
    ],
  },
]);
