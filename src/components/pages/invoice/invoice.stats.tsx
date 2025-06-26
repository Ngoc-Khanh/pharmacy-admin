import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceStatsResponse } from "@/data/interfaces";
import { ArrowUpDown, Ban, CheckCircle2, Clock, DollarSign, RefreshCw } from "lucide-react";
import { motion } from 'motion/react';

interface Props {
  statsData: InvoiceStatsResponse | undefined;
  isStatsLoading: boolean;
}

export function InvoiceStats({ statsData, isStatsLoading }: Props) {
  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Invoice Count Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/20 shadow-md col-span-1"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng số hóa đơn</h3>
            <ArrowUpDown size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {isStatsLoading ? <Skeleton className="h-8 w-16" /> : statsData?.totalInvoices}
          </p>
          {/* <div className="mt-3 text-xs text-emerald-600/80 dark:text-emerald-500/80 font-medium flex items-center gap-1">
            <ChevronUp size={14} className="text-emerald-500" />
            Tăng 8% so với tháng trước
          </div> */}
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/20 shadow-md col-span-1"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</h3>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
              }).format(statsData?.totalRevenue ?? 0)
            )}
          </p>
          {/* <div className="mt-3 text-xs text-emerald-600/80 dark:text-emerald-500/80 font-medium flex items-center gap-1">
            <ChevronUp size={14} className="text-emerald-500" />
            Tăng 12% so với tháng trước
          </div> */}
        </motion.div>

        {/* Average Value Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/20 shadow-md col-span-1"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Giá trị trung bình</h3>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
              }).format(statsData?.totalAverageRevenue ?? 0)
            )}
          </p>
          {/* <div className="mt-3 text-xs text-emerald-600/80 dark:text-emerald-500/80 font-medium flex items-center gap-1">
            <ArrowDown size={14} className="text-emerald-500" />
            Mỗi hóa đơn đã thanh toán
          </div> */}
        </motion.div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Paid Invoices Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-900/30 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Đã thanh toán</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-16 bg-green-200/50 dark:bg-green-700/30" />
                ) : (
                  <>
                    {statsData?.totalPaidInvoices}
                    <span className="text-sm font-normal text-green-600 dark:text-green-400 ml-1">
                      /{statsData?.totalInvoices}
                    </span>
                  </>
                )}
              </div>
              <div className="w-full bg-green-100 dark:bg-green-950/50 rounded-full h-1.5 mt-2">
                <div
                  className="bg-green-500 dark:bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${statsData?.totalInvoices ? (statsData?.totalPaidInvoices / statsData?.totalInvoices) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600/90 dark:text-green-400/90 mt-2">
                <span className="font-medium">{Math.round(((statsData?.totalPaidInvoices || 0) / (statsData?.totalInvoices || 1)) * 100)}%</span> hóa đơn đã thanh toán
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Invoices Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-900/30 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Chờ thanh toán</CardTitle>
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-16 bg-amber-200/50 dark:bg-amber-700/30" />
                ) : (
                  <>
                    {statsData?.totalPendingInvoices}
                    <span className="text-sm font-normal text-amber-600 dark:text-amber-400 ml-1">
                      /{statsData?.totalInvoices}
                    </span>
                  </>
                )}
              </div>
              <div className="w-full bg-amber-100 dark:bg-amber-950/50 rounded-full h-1.5 mt-2">
                <div
                  className="bg-amber-500 dark:bg-amber-500 h-1.5 rounded-full"
                  style={{ width: `${statsData?.totalInvoices ? (statsData?.totalPendingInvoices / statsData?.totalInvoices) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-amber-600/90 dark:text-amber-400/90 mt-2">
                <span className="font-medium">{Math.round(((statsData?.totalPendingInvoices || 0) / (statsData?.totalInvoices || 1)) * 100)}%</span> hóa đơn đang chờ thanh toán
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cancelled Invoices Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-rose-50 to-red-50 border-rose-100 dark:from-rose-950/30 dark:to-red-950/30 dark:border-rose-900/30 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-300">Đã hủy</CardTitle>
              <Ban className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-800 dark:text-rose-300">
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-16 bg-rose-200/50 dark:bg-rose-700/30" />
                ) : (
                  <>
                    {statsData?.totalCancelledInvoices}
                    <span className="text-sm font-normal text-rose-600 dark:text-rose-400 ml-1">
                      /{statsData?.totalInvoices}
                    </span>
                  </>
                )}
              </div>
              <div className="w-full bg-rose-100 dark:bg-rose-950/50 rounded-full h-1.5 mt-2">
                <div
                  className="bg-rose-500 dark:bg-rose-500 h-1.5 rounded-full"
                  style={{ width: `${statsData?.totalInvoices ? (statsData?.totalCancelledInvoices / statsData?.totalInvoices) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-rose-600/90 dark:text-rose-400/90 mt-2">
                <span className="font-medium">{Math.round(((statsData?.totalCancelledInvoices || 0) / (statsData?.totalInvoices || 1)) * 100)}%</span> hóa đơn đã bị hủy
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refunded Invoices Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100 dark:from-blue-950/30 dark:to-sky-950/30 dark:border-blue-900/30 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Đã hoàn tiền</CardTitle>
              <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-16 bg-blue-200/50 dark:bg-blue-700/30" />
                ) : (
                  <>
                    {statsData?.totalRefundedInvoices}
                    <span className="text-sm font-normal text-blue-600 dark:text-blue-400 ml-1">
                      /{statsData?.totalInvoices}
                    </span>
                  </>
                )}
              </div>
              <div className="w-full bg-blue-100 dark:bg-blue-950/50 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-500 dark:bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${statsData?.totalInvoices ? (statsData?.totalRefundedInvoices / statsData?.totalInvoices) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-blue-600/90 dark:text-blue-400/90 mt-2">
                <span className="font-medium">{Math.round(((statsData?.totalRefundedInvoices || 0) / (statsData?.totalInvoices || 1)) * 100)}%</span> hóa đơn đã hoàn tiền
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}