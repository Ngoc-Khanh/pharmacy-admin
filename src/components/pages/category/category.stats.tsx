import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryStatsResponse } from "@/data/interfaces";
import { Archive, FolderOpenDot, FolderSearch, ShieldAlert } from "lucide-react";
import { motion } from 'motion/react';

interface Props {
  categoriesData: CategoryStatsResponse | undefined;
  isLoading: boolean;
}

export function CategoryStats({ categoriesData, isLoading }: Props) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="col-span-1"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-amber-50 border-amber-100 dark:from-amber-950/30 dark:to-amber-950/30 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Tổng danh mục</CardTitle>
            <Archive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
              {isLoading ? <Skeleton className="h-8 w-16 bg-amber-200/50 dark:bg-amber-700/30" /> : categoriesData?.totalCategories}
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">
              Tất cả danh mục đã tạo trong hệ thống
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="col-span-1"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-amber-50 border-amber-100 dark:from-amber-950/30 dark:to-amber-950/30 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Có sản phẩm</CardTitle>
            <FolderSearch className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
              {isLoading ? <Skeleton className="h-8 w-16 bg-amber-200/50 dark:bg-amber-700/30" /> : categoriesData?.categoriesWithProducts}
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">
              <span className="font-medium">{Math.round((categoriesData?.categoriesWithProducts || 0) / (categoriesData?.totalCategories || 1) * 100)}%</span> danh mục đã có sản phẩm
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="col-span-1"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-amber-50 border-amber-100 dark:from-amber-950/30 dark:to-amber-950/30 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Chưa có sản phẩm</CardTitle>
            <FolderOpenDot className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
              {isLoading ? <Skeleton className="h-8 w-16 bg-amber-200/50 dark:bg-amber-700/30" /> : categoriesData?.categoriesWithoutProducts}
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">
              <span className="font-medium">{Math.round((categoriesData?.categoriesWithoutProducts || 0) / (categoriesData?.totalCategories || 1) * 100)}%</span> danh mục cần thêm sản phẩm
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="col-span-1"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-amber-50 border-amber-100 dark:from-amber-950/30 dark:to-amber-950/30 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Đã ẩn</CardTitle>
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
              {isLoading ? <Skeleton className="h-8 w-16 bg-amber-200/50 dark:bg-amber-700/30" /> : categoriesData?.totalInactiveCategories}
            </div>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-1">
              <span className="font-medium">{Math.round((categoriesData?.totalInactiveCategories || 0) / (categoriesData?.totalCategories || 1) * 100)}%</span> danh mục đang bị ẩn
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}