import { routes } from "@/config/routes";
import { AdminLayout, AuthLayout } from "@/layouts";
import { DashboardPage } from "@/pages/admin";
import { LoginPage } from "@/pages/auth";
import { Navigate, RouteObject } from "react-router-dom";

export const reactRouter: RouteObject[] = [
  // AUTHENTICATION PAGES
  {
    element: <AuthLayout />,
    children: [
      {
        path: routes.auth.login,
        element: <LoginPage />,
      },
    ],
  },

  // ADMIN PAGES
  {
    element: <AdminLayout />,
    children: [
      {
        path: routes.admin.root,
        element: <Navigate to={routes.admin.dashboard} />,
      },
      {
        path: routes.admin.dashboard,
        element: <DashboardPage />,
      }
    ],
  },

  // ERROR ROUTER
  { path: routes.errors.general, element: <div>General Error Page's</div> },
  { path: routes.errors.notfound, element: <div>Not Found Error Page's</div> },
  { path: routes.errors.maintenance, element: <div>Maintenance Error Page's</div> },

  // FALLBACK 404 ROUTER
  { path: "*", element: <div>Not Found Error Page's</div> },
]