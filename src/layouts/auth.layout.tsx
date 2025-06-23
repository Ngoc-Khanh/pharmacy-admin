import { isAuthenticatedAtom } from "@/atoms";
import { Spotlight } from "@/components/ui/spotlight";
import { routes } from "@/config";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  if (isAuthenticated) return <Navigate to={routes.admin.root} />

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-900 antialiased">
      {/* Left side - Login Form Area (1/3) */}
      <div className="flex-1 lg:flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-full max-w-sm">
          <div className="backdrop-blur-xl bg-white/5 border border-gray-500/20 rounded-xl p-6 shadow-2xl">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right side - Background Pattern + Spotlight (2/3) */}
      <div className="hidden lg:block lg:flex-[2] relative bg-gradient-to-br from-gray-900 via-slate-800 to-slate-900">
        {/* Grid pattern overlay */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none opacity-15",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)]",
          )}
        />

        <Spotlight
          className="-top-20 -right-20"
          fill="url(#emeraldGradient)"
        />

        {/* Decorative content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-8 px-12">
            <div className="relative">
              <div className="relative flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl mx-auto">
                <svg className="size-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
                  <circle cx="12" cy="15" r="2" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                Bảo mật & Tin cậy
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-md mx-auto">
                Hệ thống quản lý nhà thuốc với công nghệ bảo mật hiện đại,
                đảm bảo an toàn tuyệt đối cho dữ liệu của bạn.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>SSL 256-bit</span>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <span>ISO 27001</span>
              </div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                <span>GDPR</span>
              </div>
            </div>

            {/* Additional decorative elements */}
            <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto mt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Bảo vệ dữ liệu</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Xác thực</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Mã hóa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG gradient definition */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}