import { routes } from "@/config/routes";
import { AdminLayout, AuthLayout, SettingLayout } from "@/layouts";
import { AccountPage, CategoryPage, DashboardPage, InvoicePage, MedicinePage, OrderPage, SupplierPage } from "@/pages/admin";
import { InvoiceDetailPage, MedicineDetailPage } from "@/pages/admin/[id]";
import { AccountSettingPage, AppearanceSettingPage, PasswordSettingPage, ProfileSettingPage } from "@/pages/admin/settings";
import { LoginPage } from "@/pages/auth";
import { Navigate, RouteObject } from "react-router-dom";

export const reactRouter: RouteObject[] = [
  // PUBLIC PAGES
  { path: "/", element: <Navigate to={routes.admin.root} /> },

  // AUTHENTICATION PAGES
  {
    element: <AuthLayout />,
    children: [
      { path: routes.auth.login, element: <LoginPage /> },
    ],
  },

  // ADMIN PAGES
  {
    element: <AdminLayout />,
    children: [
      { path: routes.admin.root, element: <Navigate to={routes.admin.dashboard} /> },
      { path: routes.admin.dashboard, element: <DashboardPage /> },
      { path: routes.admin.account, element: <AccountPage /> },
      { path: routes.admin.categories, element: <CategoryPage /> },
      { path: routes.admin.medicines, element: <MedicinePage /> },
      { path: routes.admin.medicineDetails(":id"), element: <MedicineDetailPage /> },
      { path: routes.admin.suppliers, element: <SupplierPage /> },
      { path: routes.admin.orders, element: <OrderPage /> },
      { path: routes.admin.invoices, element: <InvoicePage /> },
      { path: routes.admin.invoiceDetails(":id"), element: <InvoiceDetailPage /> },
      {
        element: <SettingLayout />,
        children: [
          { path: routes.admin.settings.root, element: <Navigate to={routes.admin.settings.profile} /> },
          { path: routes.admin.settings.profile, element: <ProfileSettingPage /> },
          { path: routes.admin.settings.account, element: <AccountSettingPage /> },
          { path: routes.admin.settings.appearance, element: <AppearanceSettingPage /> },
          { path: routes.admin.settings.password, element: <PasswordSettingPage /> },
        ]
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