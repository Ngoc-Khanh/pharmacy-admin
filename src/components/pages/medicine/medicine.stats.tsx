import { MedicineStatsResponse } from "@/data/interfaces";
import { ArrowDown, ArrowUpDown } from "lucide-react";
import { motion } from 'motion/react';

interface MedicineStatsProps {
  statsData: MedicineStatsResponse | undefined;
  isLoading: boolean;
}

export function MedicineStats({ statsData, isLoading }: MedicineStatsProps) {
  return (
    <div className="grid gap-6 grid-cols-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/20 shadow-md col-span-1"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng số thuốc</h3>
          <ArrowUpDown size={16} className="text-fuchsia-500" />
        </div>
        <p className="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
          {isLoading ? (
            <div className="flex gap-1">
              <span className="animate-bounce [animation-delay:-0.3s]">•</span>
              <span className="animate-bounce [animation-delay:-0.15s]">•</span>
              <span className="animate-bounce">•</span>
            </div>
          ) : statsData?.totalMedicine}
        </p>
        <div className="mt-3 text-xs text-fuchsia-600/80 dark:text-fuchsia-500/80 font-medium flex items-center gap-1">
          <ArrowDown size={14} className="text-fuchsia-500" />
          Đã cập nhật
        </div>
      </motion.div>
    </div>
  )
}