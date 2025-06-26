import { OrderDialog } from "@/components/dialogs/order.dialog";
import { orderColumns, OrderDataTable } from "@/components/table/order";
import { routeNames, routes, siteConfig } from "@/config";
import { OrderResponse } from "@/data/interfaces";
import { useTable } from "@/hooks";
import { OrderAPI } from "@/services/v1";
import { ShoppingCart } from "lucide-react";
import { motion } from 'motion/react';
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

export default function OrderPage() {
  const {
    data: orderData,
    isLoading,
    isChangingPage,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useTable<OrderResponse>({
    queryKey: "orders",
    dataFetcher: OrderAPI.OrderList,
  });

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
        <title>{routeNames[routes.admin.orders]} | {siteConfig.name}</title>
      </Helmet>

      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-800/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-100 dark:bg-rose-800/30 p-2.5 rounded-lg">
              <ShoppingCart size={28} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-rose-800 dark:text-rose-300">
              Quản lý đơn hàng
            </h2>
          </div>
          <p className="text-rose-600/90 dark:text-rose-400/80 ml-[52px]">
            Quản lý đơn hàng, đơn đặt hàng và lịch sử giao dịch
          </p>
        </motion.div>

        {/* Table Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShoppingCart size={18} className="text-rose-500" />
                Danh sách đơn hàng
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Theo dõi và quản lý các đơn hàng, đơn đặt hàng và lịch sử giao dịch
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-rose-100 dark:border-rose-900/30"
          >
            <div className="p-4 md:p-6">
              <OrderDataTable
                columns={orderColumns}
                data={orderData}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isLoading={isLoading}
                isChangingPage={isChangingPage}
                pagination={paginationProps}
              />
            </div>
          </motion.div>
        </div>

        <OrderDialog />
      </div>
    </div>
  );
}