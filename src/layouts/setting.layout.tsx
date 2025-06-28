import { SettingSidebar } from "@/components/layouts/setting";
import { Separator } from "@/components/ui/separator";
import { settingSidebarConfig } from "@/config";
import { Settings } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function SettingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
        <div className="flex-col md:flex">
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className='space-y-1'>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h1 className='text-2xl font-semibold tracking-tight'>
                    Cài đặt
                  </h1>
                  <p className='text-sm text-muted-foreground'>
                    Quản lý thiết lập hệ thống
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Main Content */}
            <div className='flex flex-1 flex-col gap-6 lg:flex-row'>
              {/* Sidebar */}
              <aside className='lg:w-60 lg:shrink-0'>
                <SettingSidebar items={settingSidebarConfig} />
              </aside>

              {/* Content Area */}
              <div className='flex-1 min-w-0'>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}