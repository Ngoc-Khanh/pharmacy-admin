import { Button } from "@/components/ui/button"
import { routes } from "@/config"
import { motion } from "framer-motion"
import { Activity, BarChart3, Plus } from "lucide-react"
import { Link } from "react-router-dom"

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 rounded-xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-100 dark:bg-emerald-800/30 p-2.5 rounded-lg">
              <BarChart3 size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">
              Thống kê trang web
            </h2>
          </div>
          <p className="text-emerald-600/90 dark:text-emerald-400/80 ml-[52px]">
            Tổng quan hoạt động và thống kê hệ thống Pharmacity Store
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to={routes.admin.medicines}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm thuốc
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20">
            <Link to={routes.admin.orders}>
              <Activity className="h-4 w-4 mr-2" />
              Xem đơn hàng
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}