import CategoryDialog from "@/components/dialogs/category.dialog";
import { CategoryPrimaryButtons, CategoryStats } from "@/components/pages/category";
import { categoryColumns, CategoryDataTable } from "@/components/table/category";
import { Skeleton } from "@/components/ui/skeleton";
import { routeNames, routes, siteConfig } from "@/config";
import { CategoryAPI } from "@/services/v1";
import { useQuery } from "@tanstack/react-query";
import { FolderTree } from "lucide-react";
import { motion } from 'motion/react';
import { Helmet } from "react-helmet-async";

export default function CategoryPage() {
  const { data: categoriesList, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryAPI.CategoryList,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const categoriesData = categoriesList || [];

  return (
    <div className="flex-col md:flex">
      <Helmet>
        <title>{routeNames[routes.admin.categories]} | {siteConfig.name}</title>
      </Helmet>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-amber-800/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-100 dark:bg-amber-800/30 p-2.5 rounded-lg">
              <FolderTree size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-amber-800 dark:text-amber-300">
              Quản lý danh mục
            </h2>
          </div>
          <p className="text-amber-600/90 dark:text-amber-400/80 ml-[52px]">
            Thêm, sửa và quản lý danh mục phân loại sản phẩm để tạo cấu trúc cho hệ thống Pharmacity Store
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <CategoryStats categoriesData={categoriesData} isLoading={isLoading} />

        <div className="grid gap-4 grid-cols-1">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FolderTree size={18} className="text-amber-600 dark:text-amber-400" />
                    Danh sách tất cả danh mục
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Quản lý và sắp xếp các danh mục sản phẩm
                  </p>
                </motion.div>
                <CategoryPrimaryButtons />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/30"
              >
                <div className="p-4 md:p-6">
                  <CategoryDataTable columns={categoryColumns} data={categoriesData} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
        <CategoryDialog />
      </div>
    </div>
  );
}