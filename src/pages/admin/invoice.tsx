import InvoiceDialog from "@/components/dialogs/invoice.dialog";
import { invoiceColumns, InvoiceDataTable, InvoicePrimaryButtons } from "@/components/table/invoice";
import { routeNames, routes, siteConfig } from "@/config";
import { InvoiceResponse } from "@/data/interfaces";
import { useTable } from "@/hooks";
import { InvoiceAPI } from "@/services/v1";
import { Receipt } from "lucide-react";
import { motion } from 'motion/react';
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

export default function InvoicePage() {
  const {
    data: invoiceData,
    isLoading,
    isChangingPage,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useTable<InvoiceResponse>({
    queryKey: "invoices",
    dataFetcher: InvoiceAPI.InvoiceList,
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
        <title>{routeNames[routes.admin.invoices]} | {siteConfig.name}</title>
      </Helmet>

      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-50 to-emerald-50 dark:from-emerald-950/40 dark:to-emerald-950/40 rounded-xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-100 dark:bg-emerald-800/30 p-2.5 rounded-lg">
              <Receipt size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">
              Quản lý Hóa đơn
            </h2>
          </div>
          <p className="text-emerald-600/90 dark:text-emerald-400/80 ml-[52px]">
            Quản lý hóa đơn và giao dịch tài chính của khách hàng tại Pharmacity Store
          </p>
        </motion.div>

        {/* Statistics */}
        {/* <InvoiceStats /> */}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Receipt size={18} className="text-emerald-500" />
                Danh sách hóa đơn
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Quản lý và theo dõi hóa đơn của khách hàng
              </p>
            </motion.div>
            <InvoicePrimaryButtons />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30"
          >
            <div className="p-4 md:p-6">
              <InvoiceDataTable
                columns={invoiceColumns}
                data={invoiceData}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isLoading={isLoading}
                isChangingPage={isChangingPage}
                pagination={paginationProps}
              />
            </div>
          </motion.div>
        </div>

        <InvoiceDialog />
      </div>
    </div>
  );
}