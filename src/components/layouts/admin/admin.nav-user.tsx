import { LogOutDialog } from "@/components/dialogs/logout.dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { routes } from "@/config";
import { UserResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";

import { LogOut, MoreVerticalIcon, Settings, Shield, Sparkles, UserIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function AdminNavUser({ user }: { user: UserResponse }) {
  const { isMobile } = useSidebar()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleLogoutClose = () => {
    setIsLogoutOpen(false);
  };

  return (
    <SidebarMenu className="gap-1">
      {/* User Dropdown */}
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "rounded-xl transition-all duration-200 group",
                isDropdownOpen
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <Avatar className={cn(
                "h-8 w-8 rounded-xl border-2 transition-all",
                isDropdownOpen
                  ? "border-sidebar-ring"
                  : "border-sidebar-border group-hover:border-sidebar-ring/50"
              )}>
                <AvatarImage src={user.profileImage.url} alt={user.profileImage.alt} />
                <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {user.firstname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstname} {user.lastname}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-4 text-left">
                <Avatar className="h-12 w-12 rounded-xl border-2 border-sidebar-border">
                  <AvatarImage src={user.profileImage.url} alt={user.profileImage.alt} />
                  <AvatarFallback className="rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {user.firstname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-0.5">
                  <span className="text-base font-semibold">{user.firstname} {user.lastname}</span>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <Shield className="h-3 w-3" /> Quản trị viên
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div className="px-2 py-1.5">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-gradient-to-br focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 dark:focus:from-purple-900/30 dark:focus:to-pink-900/30 dark:focus:text-purple-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1 grid">
                  <span className="font-medium">Nâng cấp thành viên</span>
                  <span className="text-xs text-muted-foreground">Mở khóa tính năng cao cấp</span>
                </div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            <div className="px-2 py-1.5">
              <Link to={routes.admin.settings.root} className="w-full">
                <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-900/20 dark:focus:text-emerald-300">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 grid">
                    <span className="font-medium">Thông tin cá nhân</span>
                    <span className="text-xs text-muted-foreground">Cập nhật thông tin & mật khẩu</span>
                  </div>
                </DropdownMenuItem>
              </Link>
            </div>

            <div className="px-2 py-1.5">
              <Link to={routes.admin.settings.root}>
                <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-900/20 dark:focus:text-emerald-300">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Cài đặt hệ thống</span>
                </DropdownMenuItem>
              </Link>
            </div>

            <DropdownMenuSeparator />

            <div className="mt-2">
              <ModeToggle className="w-full rounded-lg hover:bg-accent" />
            </div>

            <DropdownMenuSeparator />

            <div className="px-2 py-1.5 pb-3">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(false);
                  setTimeout(() => {
                    handleLogoutClick();
                  }, 100);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2.5 focus:bg-destructive/10 focus:text-destructive"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="font-medium">Đăng xuất</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <LogOutDialog isOpen={isLogoutOpen} onClose={handleLogoutClose} />
    </SidebarMenu>
  );
}