const baseRoutes = {
  // AUTHENTICATION ROUTES
  auth: {
    login: "/login",
  },

  // ADMIN ROUTES
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    account: "/admin/account",
    categories: "/admin/categories",
    medicines: "/admin/medicines",
    medicineDetails: (id: string) => `/admin/medicines/${id}/detail`,
    suppliers: "/admin/suppliers",
    orders: "/admin/orders",
    invoices: "/admin/invoices",
    invoiceDetails: (id: string) => `/admin/invoices/${id}/detail`,
    settings: {
      root: "/admin/settings",
      profile: "/admin/settings/profile",
      account: "/admin/settings/account",
      appearance: "/admin/settings/appearance",
      password: "/admin/settings/password",
    }
  },

  // ERROR ROUTES
  errors: {
    general: "/500",
    notfound: "/404",
    maintenance: "/503",
    unauthorized: "/401",
  },
};

export const routeNames = {
  // AUTHENTICATION NAME ROUTES
  [baseRoutes.auth.login]: "Đăng nhập",

  // ADMIN NAME ROUTES
  [baseRoutes.admin.root]: "Trang chủ",
  [baseRoutes.admin.dashboard]: "Thống kê",
  [baseRoutes.admin.account]: "Quản lý tài khoản",
  [baseRoutes.admin.categories]: "Quản lý danh mục",
  [baseRoutes.admin.medicines]: "Quản lý dược phẩm",
  [baseRoutes.admin.medicineDetails(":id")]: "Chi tiết dược phẩm",
  [baseRoutes.admin.suppliers]: "Quản lý nhà cung cấp",
  [baseRoutes.admin.orders]: "Quản lý đơn hàng",
  [baseRoutes.admin.invoices]: "Quản lý hóa đơn",
  [baseRoutes.admin.invoiceDetails(":id")]: "Chi tiết hóa đơn",
  [baseRoutes.admin.settings.root]: "Cài đặt",
  [baseRoutes.admin.settings.profile]: "Cài đặt hồ sơ",
  [baseRoutes.admin.settings.account]: "Cài đặt tài khoản",
  [baseRoutes.admin.settings.appearance]: "Cài đặt giao diện",
  [baseRoutes.admin.settings.password]: "Cài đặt mật khẩu",
};

export const routes = {
  ...baseRoutes,
};
