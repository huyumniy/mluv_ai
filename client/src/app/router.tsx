import { createBrowserRouter } from "react-router";

import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LandingLayout } from "@/layouts/LandingLayout";

import { BillingPage } from "@/pages/BillingPage";
import { CreateLessonPage } from "@/pages/CreateLessonPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { LessonsPage } from "@/pages/LessonsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SettingsPage } from "@/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <LandingPage />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/lessons",
        element: <LessonsPage />,
      },
      {
        path: "/create-lesson",
        element: <CreateLessonPage />,
      },
      {
        path: "/billing",
        element: <BillingPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);