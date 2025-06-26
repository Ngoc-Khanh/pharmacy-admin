import { OrderStatsResponse } from "@/data/interfaces";
import { ArrowDown, ArrowUpDown, Calendar, Clock, FileSpreadsheet } from "lucide-react";
import { motion } from 'motion/react';

interface OrderStatsProps {
  statsData: OrderStatsResponse | undefined;
  isLoading: boolean;
}

export function OrderStats({ statsData, isLoading }: OrderStatsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-100 dark:border-rose-800/20 shadow-md"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-rose-500 dark:text-rose-400">Tổng đơn hàng</h3>
          <ArrowUpDown size={16} className="text-rose-500" />
        </div>
        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {isLoading ? (
            <div className="flex gap-1">
              <span className="animate-bounce [animation-delay:-0.3s]">•</span>
              <span className="animate-bounce [animation-delay:-0.15s]">•</span>
              <span className="animate-bounce">•</span>
            </div>
          ) : statsData?.totalOrders}
        </p>
        <div className="mt-3 text-xs text-rose-600/80 dark:text-rose-500/80 font-medium flex items-center gap-1">
          <ArrowDown size={14} className="text-rose-500" />
          Đã cập nhật
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-100 dark:border-rose-800/20 shadow-md"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-rose-500 dark:text-rose-400">Đơn hàng hôm nay</h3>
          <Calendar size={16} className="text-rose-500" />
        </div>
        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
          {isLoading ? (
            <div className="flex gap-1">
              <span className="animate-bounce [animation-delay:-0.3s]">•</span>
              <span className="animate-bounce [animation-delay:-0.15s]">•</span>
              <span className="animate-bounce">•</span>
            </div>
          ) : statsData?.totalOrdersToday}
        </p>
        <div className="mt-3 text-xs text-rose-600/80 dark:text-rose-500/80 font-medium flex items-center gap-1">
          <Clock size={14} className="text-rose-500" />
          Cập nhật theo thời gian thực
        </div>
      </motion.div>

      <div className="hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-blue-100 dark:border-blue-800/20 shadow-md flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Báo cáo đơn hàng</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">Xuất báo cáo</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-lg border border-blue-200 dark:border-blue-800/30 font-medium transition-all shadow-sm w-full md:w-auto justify-center"
          >
            <FileSpreadsheet size={18} />
            <span>Tải xuống</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}