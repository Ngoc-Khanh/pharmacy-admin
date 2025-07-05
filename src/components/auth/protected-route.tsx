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
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <img 
              src="/hin.gif" 
              alt="Loading..." 
              className="w-28 h-28 object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">Đang tải...</h3>
            <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về trang login
  if (!isAuthenticated) return <Navigate to={routes.auth.login} state={{ from: location }} replace />;
  
  // Tài khoản chưa được kích hoạt (chỉ áp dụng trong production)
  if (!isActiveUser && import.meta.env.PROD) {
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