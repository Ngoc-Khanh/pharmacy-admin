import SupplierDialog from "@/components/dialogs/supplier.dialog";
import { SuppliersPrimaryButtons } from "@/components/pages/supplier";
import { supplierColumns, SupplierDataTable } from "@/components/table/suppiler";
import { Skeleton } from "@/components/ui/skeleton";
import { routeNames, routes, siteConfig } from "@/config";
import { SupplierAPI } from "@/services/v1";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { motion } from 'motion/react';
import { Helmet } from "react-helmet-async";

export default function SupplierPage() {
  const { data: suppliersList, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: SupplierAPI.SupplierList,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const suppliersData = suppliersList || [];

  return (
    <div className="flex-col md:flex">
      <Helmet>
        <title>{routeNames[routes.admin.account]} | {siteConfig.name}</title>
      </Helmet>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-rose-50 to-rose-50 dark:from-rose-950/40 dark:to-rose-950/40 rounded-xl p-6 shadow-sm border border-rose-100 dark:border-rose-800/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-100 dark:bg-rose-800/30 p-2.5 rounded-lg">
              <Building2 size={28} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-rose-800 dark:text-rose-300">
              Quản lý Nhà cung cấp
            </h2>
          </div>
          <p className="text-rose-600/90 dark:text-rose-400/80 ml-[52px]">
            Quản lý danh sách các đối tác cung cấp thuốc và các sản phẩm cho hệ thống Pharmacity Store
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {/* <SupplierStats statsData={statsData} isLoading={isStatsLoading} /> */}

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
                    <Building2 size={18} className="text-rose-600 dark:text-rose-400" />
                    Danh sách tất cả nhà cung cấp
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Quản lý và sắp xếp các nhà cung cấp
                  </p>
                </motion.div>
                <SuppliersPrimaryButtons />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-rose-100 dark:border-rose-800/30"
              >
                <div className="p-4 md:p-6">
                  <SupplierDataTable columns={supplierColumns} data={suppliersData} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <SupplierDialog />
    </div>
  );
}