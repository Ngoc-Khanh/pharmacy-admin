import { hasAdminAccessAtom, isActiveUserAtom, isAuthenticatedAtom, userLoadingAtom } from "@/atoms";
import { routes } from "@/config/routes";
import { useAtomValue } from "jotai";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isActiveUser = useAtomValue(isActiveUserAtom);
  const hasAdminAccess = useAtomValue(hasAdminAccessAtom);
  const userLoading = useAtomValue(userLoadingAtom);
  const location = useLocation();

  // Hiển thị loading khi đang fetch user info
  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login} state={{ from: location }} replace />;
  }

  // Tài khoản chưa được kích hoạt
  if (!isActiveUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Tài khoản chưa được kích hoạt</h2>
          <p className="mt-2 text-muted-foreground">
            Vui lòng liên hệ quản trị viên để kích hoạt tài khoản của bạn.
          </p>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền truy cập admin (admin hoặc pharmacist)
  if (!hasAdminAccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Không có quyền truy cập</h2>
          <p className="mt-2 text-muted-foreground">
            Bạn không có quyền truy cập vào trang quản trị. Chỉ quản trị viên và dược sĩ mới có thể truy cập.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 