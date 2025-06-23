const baseRoutes = {
  // AUTHENTICATION ROUTES
  auth: {
    login: "/login",
  },

  // ADMIN ROUTES
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    categories: "/admin/categories",
    medicines: "/admin/medicines",
    medicineDetails: (id: string) => `/admin/medicines/${id}/detail`,
    suppliers: "/admin/suppliers",
    orders: "/admin/orders",
    invoices: "/admin/invoices",
    invoiceDetails: (id: string) => `/admin/invoice/${id}/detail`,
    settings: {
      root: "/admin/settings",
    }
  },

  // ERROR ROUTES
  errors: {
    general: "/500",
    notfound: "/404",
    maintenance: "/503",
  },
};

export const routeNames = {
  // AUTHENTICATION NAME ROUTES
  [baseRoutes.auth.login]: "Đăng nhập",

  // ADMIN NAME ROUTES
  [baseRoutes.admin.root]: "Trang chủ",
  [baseRoutes.admin.dashboard]: "Thống kê",
  [baseRoutes.admin.settings.root]: "Cài đặt",
  [baseRoutes.admin.users]: "Quản lý người dùng",
  [baseRoutes.admin.categories]: "Quản lý danh mục",
  [baseRoutes.admin.medicines]: "Quản lý dược phẩm",
  [baseRoutes.admin.medicineDetails(":id")]: "Chi tiết dược phẩm",
  [baseRoutes.admin.suppliers]: "Quản lý nhà cung cấp",
  [baseRoutes.admin.orders]: "Quản lý đơn hàng",
  [baseRoutes.admin.invoices]: "Quản lý hóa đơn",
  [baseRoutes.admin.invoiceDetails(":id")]: "Chi tiết hóa đơn",
};

export const routes = {
  ...baseRoutes,
};
