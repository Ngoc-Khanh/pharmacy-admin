import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { isPharmacistUserAtom } from "@/atoms";
import { routes } from "@/config";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AdminNavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    badge?: string
  }[]
}) {
  const location = useLocation();
  const isPharmacist = useAtomValue(isPharmacistUserAtom);

  // Lọc bỏ mục "Quản lý tài khoản" nếu user là PHARMACIST
  const filteredItems = isPharmacist 
    ? items.filter(item => item.url !== routes.admin.account)
    : items;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 py-2">
        <SidebarMenu>
          {filteredItems.map((item) => {
            // Check if current pathname matches or starts with the item URL
            const isActive = location.pathname === item.url ||
              (item.url !== '#' && item.url !== '/' && location.pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={item.title} className="relative">
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className={`group transition-all duration-200 ${isActive
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                    : "hover:bg-emerald-50 text-slate-600 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-600 dark:bg-emerald-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {item.icon && (
                      <div className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${isActive ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
                        }`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                    )}
                    <span className={`font-medium ${isActive ? "text-emerald-700 dark:text-emerald-300" : ""}`}>{item.title}</span>
                    {item.badge && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}