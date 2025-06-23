import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { routeNames, routes } from "@/config";
import { Home } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export function AdminHeader() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  
  return (
    <header className="flex sticky top-0 z-50 h-12 rounded-t-3xl shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-0 lg:gap-2 lg:px-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to={routes.admin.dashboard}>
                    <Home size={16} strokeWidth={2} aria-hidden="true" />
                    <span className="sr-only">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathnames.map((value, index) => {
                if (value.match(/^\d+$/)) return null;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                let displayName = routeNames[to];
                if (!displayName) displayName = value.charAt(0).toUpperCase() + value.slice(1);
                return (
                  <React.Fragment key={to}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{displayName}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={to}>{displayName}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mr-4 w-full flex-1 md:w-auto md:flex-none">
          {/* <NavCommand /> */}
        </div>
      </div>
    </header>
  )
}