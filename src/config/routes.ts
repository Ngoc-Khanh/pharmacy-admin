const baseRoutes = {
  // AUTHENTICATION ROUTES
  auth: {
    login: "/login",
  },

  // ADMIN ROUTES
  admin: {
    root: "/admin",
    users: "/admin/users",
    products: "/admin/products",
    orders: "/admin/orders",
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
  [baseRoutes.admin.users]: "Quản lý người dùng",
  [baseRoutes.admin.products]: "Quản lý sản phẩm",
  [baseRoutes.admin.orders]: "Quản lý đơn hàng",
};

export const routes = {
  ...baseRoutes,
};
