import { StockStatus } from "@/data/enum";
import { CircleDot } from "lucide-react";

export const getStockConfig = (status?: string) => {
  if (status === StockStatus.OUT_OF_STOCK) return {
    variant: "destructive",
    label: "Hết hàng",
    icon: <CircleDot className="h-3 w-3" />,
    bg: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    hover: "hover:bg-red-200 dark:hover:bg-red-950/60"
  };
  if (status === StockStatus.PRE_ORDER) return {
    variant: "warning",
    label: "Đặt trước",
    icon: <CircleDot className="h-3 w-3 text-amber-500" />,
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    hover: "hover:bg-amber-200 dark:hover:bg-amber-950/60"
  };
  return {
    variant: "outline",
    label: "Còn hàng",
    icon: <CircleDot className="h-3 w-3 text-teal-500" />,
    bg: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    hover: "hover:bg-teal-200 dark:hover:bg-teal-950/60"
  };
};