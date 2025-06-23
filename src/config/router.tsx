import { routes } from "@/config/routes";
import { AdminLayout, AuthLayout } from "@/layouts";
import { AccountPage, CategoryPage, DashboardPage, InvoicePage, MedicinePage, OrderPage, SupplierPage } from "@/pages/admin";
import { LoginPage } from "@/pages/auth";
import { Navigate, RouteObject } from "react-router-dom";

export const reactRouter: RouteObject[] = [
  // PUBLIC PAGES
  {
    path: "/",
    element: <Navigate to={routes.admin.root} />,
  },

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
      },
      {
        path: routes.admin.account,
        element: <AccountPage />,
      },
      {
        path: routes.admin.categories,
        element: <CategoryPage />,
      },
      {
        path: routes.admin.medicines,
        element: <MedicinePage />,
      },
      {
        path: routes.admin.suppliers,
        element: <SupplierPage />,
      },
      {
        path: routes.admin.orders,
        element: <OrderPage />,
      },
      {
        path: routes.admin.invoices,
        element: <InvoicePage />,
      },
    ],
  },

  // ERROR ROUTER
  { path: routes.errors.general, element: <div>General Error Page's</div> },
  { path: routes.errors.notfound, element: <div>Not Found Error Page's</div> },
  { path: routes.errors.maintenance, element: <div>Maintenance Error Page's</div> },

  // FALLBACK 404 ROUTER
  { path: "*", element: <div>Not Found Error Page's</div> },
]