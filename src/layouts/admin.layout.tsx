import { isAuthenticatedAtom } from "@/atoms";
import { AdminHeader } from "@/components/layouts/admin/admin.header";
import { AppSidebar } from "@/components/layouts/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { routes } from "@/config";
import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  if (!isAuthenticated) return <Navigate to={routes.auth.login} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 antialiased">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AdminHeader />
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}