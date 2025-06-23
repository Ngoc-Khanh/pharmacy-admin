import { AccountRole } from "@/data/enum";
import { UserResponse } from "@/data/interfaces";
import { TrendingUp, User2, UserCheck, UserCog } from "lucide-react";
import { motion } from 'motion/react';

interface Props {
  accountData: UserResponse[];
  isLoading: boolean;
}

export function AccountStats({ accountData, isLoading }: Props) {
  const adminCount = accountData.filter(account => account.role === AccountRole.ADMIN).length;
  const customerCount = accountData.filter(account => account.role === AccountRole.CUSTOMER).length;
  const pharmacistCount = accountData.filter(account => account.role === AccountRole.PHARMACIST).length;

  const stats = [
    {
      title: "Tổng người dùng",
      value: accountData.length,
      icon: TrendingUp,
      color: "from-cyan-400 via-cyan-500 to-cyan-600",
      iconBg: "bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      textColor: "text-cyan-600 dark:text-cyan-400",
      subText: "Tất cả tài khoản",
      borderColor: "border-cyan-200/50 dark:border-cyan-800/30"
    },
    {
      title: "Khách hàng",
      value: customerCount,
      icon: User2,
      color: "from-blue-400 via-blue-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      textColor: "text-blue-600 dark:text-blue-400",
      subText: "Người dùng thường",
      borderColor: "border-blue-200/50 dark:border-blue-800/30"
    },
    {
      title: "Dược sĩ",
      value: pharmacistCount,
      icon: UserCheck,
      color: "from-emerald-400 via-emerald-500 to-emerald-600",
      iconBg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      subText: "Nhân viên tư vấn",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30"
    },
    {
      title: "Quản trị viên",
      value: adminCount,
      icon: UserCog,
      color: "from-purple-400 via-purple-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      textColor: "text-purple-600 dark:text-purple-400",
      subText: "Quyền quản lý",
      borderColor: "border-purple-200/50 dark:border-purple-800/30"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1
            }}
            className={`
              relative overflow-hidden
              bg-white dark:bg-slate-900/80 
              p-5 rounded-xl 
              border ${stat.borderColor}
              shadow-sm
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`
                ${stat.iconBg} 
                p-2 rounded-lg
              `}>
                <Icon size={18} className={stat.textColor} />
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.title}
              </h3>
            </div>

            {/* Value */}
            <div className="mb-2">
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {isLoading ? (
                  <div className="flex gap-1">
                    <span className="animate-bounce [animation-delay:-0.3s]">•</span>
                    <span className="animate-bounce [animation-delay:-0.15s]">•</span>
                    <span className="animate-bounce">•</span>
                  </div>
                ) : (
                  stat.value.toLocaleString()
                )}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stat.subText}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}