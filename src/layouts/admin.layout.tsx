import { isAuthenticatedAtom } from "@/atoms";
import { routes } from "@/config";
import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  if (!isAuthenticated) return <Navigate to={routes.auth.login} />

  return <Outlet />
}