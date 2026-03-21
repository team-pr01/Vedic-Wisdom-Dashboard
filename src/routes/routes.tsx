import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import VerifyOtp from "../pages/Auth/VerifyOtp/VerifyOtp";
import Users from "../pages/Users/Users";
import AudioBooks from "../pages/AudioBooks/AudioBooks";
import Temple from "../pages/Temple/Temple";
import TempleDetails from "../pages/Temple/TempleDetails/TempleDetails";
import Food from "../pages/Food/Food";
import Course from "../pages/Course/Course";
import Video from "../pages/Video/Video";
import Ayurveda from "../pages/Ayurveda/Ayurveda";
import Emergency from "../pages/Emergency/Emergency";

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
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "audio-books",
        element: <AudioBooks />,
      },
      {
        path: "temple",
        element: <Temple />,
      },
      {
        path: "temple/:id",
        element: <TempleDetails />,
      },
      {
        path: "food",
        element: <Food />,
      },
      {
        path: "course",
        element: <Course />,
      },
      {
        path: "video",
        element: <Video />,
      },
      {
        path: "ayurveda",
        element: <Ayurveda />,
      },
      {
        path: "emergency",
        element: <Emergency />,
      },
    ],
  },
]);
