import CategoryDialog from "@/components/dialogs/category.dialog";
import { CategoryPrimaryButtons, CategoryStats } from "@/components/pages/category";
import { categoryColumns, CategoryDataTable } from "@/components/table/category";
import { routeNames, routes, siteConfig } from "@/config";
import { CategoryResponse, CategoryStatsResponse } from "@/data/interfaces";
import { useTable } from "@/hooks";
import { CategoryAPI } from "@/services/v1";
import { FolderTree } from "lucide-react";
import { motion } from 'motion/react';
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

export default function CategoryPage() {
  const {
    data: categoriesData,
    statsData,
    isStatsLoading,
    isLoading,
    isChangingPage,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useTable<CategoryResponse, CategoryStatsResponse>({
    queryKey: "categories",
    dataFetcher: CategoryAPI.CategoryList,
    statsFetcher: CategoryAPI.CategoryStats,
  });

  // Memoize pagination props để tránh re-render không cần thiết
  const paginationProps = useMemo(() => {
    if (searchTerm) return undefined; // Không hiển thị pagination khi đang search
    return {
      currentPage: paginationInfo.currentPage,
      totalPages: paginationInfo.totalPages,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      pageSize,
      totalItems: paginationInfo.totalItems
    };
  }, [
    searchTerm,
    paginationInfo.currentPage,
    paginationInfo.totalPages,
    paginationInfo.totalItems,
    handlePageChange,
    handlePageSizeChange,
    pageSize
  ]);

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
        <CategoryStats categoriesData={statsData} isLoading={isStatsLoading} />

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
              <CategoryDataTable
                columns={categoryColumns}
                data={categoriesData}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isLoading={isLoading}
                isChangingPage={isChangingPage}
                pagination={paginationProps}
              />
            </div>
          </motion.div>
        </div>

        <CategoryDialog />
      </div>
    </div>
  );
}