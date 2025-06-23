import { userAtom } from "@/atoms";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { routes, sidebarConfig } from "@/config";
import { useAtomValue } from "jotai";
import { BriefcaseMedical } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminNavMain } from "./admin.nav-main";
import { AdminNavSecondary } from "./admin.nav-secondary";
import { AdminNavUser } from "./admin.nav-user";
import { AdminNavUserSkeleton } from "./admin.skeleton-nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAtomValue(userAtom);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-emerald-200 dark:border-emerald-700/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={routes.admin.dashboard} className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
                <BriefcaseMedical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-base font-semibold">Pharmacy Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={sidebarConfig.navMain} />
        <AdminNavSecondary items={sidebarConfig.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-emerald-200 dark:border-emerald-700/50">
        {user ? <AdminNavUser user={user} /> : <AdminNavUserSkeleton />}
      </SidebarFooter>
    </Sidebar>
  )
}