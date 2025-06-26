import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierStatsResponse } from "@/data/interfaces";
import { slideIn } from "@/lib/motion-vartiant";
import { Building2, Sparkles } from "lucide-react";
import { motion } from 'motion/react';

interface SupplierStatsProps {
  statsData: SupplierStatsResponse | undefined;
  isLoading: boolean;
}

export function SupplierStats({ statsData, isLoading }: SupplierStatsProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 gap-5 mb-8"
    >
      <motion.div variants={slideIn}>
        <Card className="bg-white dark:bg-slate-900/90 shadow-md hover:shadow-lg transition-shadow border-slate-200/70 dark:border-slate-800/70 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-violet-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-violet-500" />
              Tổng nhà cung cấp
            </CardTitle>
            <CardDescription>Tổng số đối tác trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
              {isLoading ? (
                <div className="flex gap-1">
                  <span className="animate-bounce [animation-delay:-0.3s]">•</span>
                  <span className="animate-bounce [animation-delay:-0.15s]">•</span>
                  <span className="animate-bounce">•</span>
                </div>
              ) : statsData?.totalSuppliers}
            </p>
            <div className="text-xs text-violet-500 mt-2 flex items-center">
              <Sparkles size={12} className="mr-1" />
              Đang hoạt động tích cực
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}