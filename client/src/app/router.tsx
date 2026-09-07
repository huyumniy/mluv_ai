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
import { CreateLessonSettingsPage } from "@/pages/CreateLessonSettingsPage";
import { CreateLessonPhrasesPage } from "@/pages/CreateLessonPhrasesPage";
import { CreateLessonFlow } from "@/layouts/DashboardLayout/create-lesson-flow";

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
        element: <CreateLessonFlow />,
        children: [
          {
            path: "/create-lesson",
            element: <CreateLessonPage />,
          },
          {
            path: "/create-lesson/:topicId/settings",
            element: <CreateLessonSettingsPage />,
          },
          {
            path: "/create-lesson/:topicId/phrases",
            element: <CreateLessonPhrasesPage />,
          }
        ]
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