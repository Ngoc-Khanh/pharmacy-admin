import { useOrderDialog } from "@/atoms";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { routes } from "@/config";
import { OrderStatus } from "@/data/enum";
import { OrderResponse } from "@/data/interfaces";
import { InvoiceAPI } from "@/services/v1";
import { Row } from "@tanstack/react-table";
import { AlertCircle, CheckCircle2, Eye, FileText, MoreHorizontal, PackageCheck, Trash } from "lucide-react";
import { motion } from 'motion/react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrderRowActionsProps {
  row: Row<OrderResponse>;
}

export function OrderRowActions({ row }: OrderRowActionsProps) {
  const { setOpen, setCurrentOrder } = useOrderDialog();
  const navigate = useNavigate();
  const order = row.original;
  const orderStatus = order.status as OrderStatus;
  const canConfirm = orderStatus === OrderStatus.PENDING;
  const canDeliver = orderStatus === OrderStatus.SHIPPED || orderStatus === OrderStatus.PROCESSING;
  const canCancel = orderStatus !== OrderStatus.CANCELLED &&
    orderStatus !== OrderStatus.DELIVERED &&
    orderStatus !== OrderStatus.COMPLETED;

  const handleViewDetails = () => {
    setCurrentOrder(order);
    setOpen("detail");
  };

  const handleConfirmOrder = () => {
    setCurrentOrder(order);
    setOpen("confirm");
  };

  const handleCompleteOrder = () => {
    setCurrentOrder(order);
    setOpen("complete");
  };

  const handleCancelOrder = () => {
    setCurrentOrder(order);
    setOpen("cancel");
  };

  const handleViewInvoice = async () => {
    try {
      const invoice = await InvoiceAPI.InvoiceByOrderId(order.id);
      navigate(routes.admin.invoiceDetails(invoice.id));
    } catch (error) {
      toast.error("Không thể tải hóa đơn. Có thể đơn hàng chưa có hóa đơn.");
      console.error("[OrderRowActions] Error fetching invoice:", error);
    }
  };

  return (
    <div className="flex justify-end items-center gap-1">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full data-[state=open]:bg-rose-50 dark:data-[state=open]:bg-rose-900/20 data-[state=open]:text-rose-500 dark:data-[state=open]:text-rose-400 transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-800/30 shadow-lg rounded-lg overflow-hidden p-1.5"
          sideOffset={5}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-0.5"
          >
            <DropdownMenuItem
              onClick={handleViewDetails}
              className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 rounded-md group transition-colors"
            >
              <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-1 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                <Eye className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              </div>
              <span className="text-blue-600 dark:text-blue-400">Xem chi tiết</span>
            </DropdownMenuItem>

            {canConfirm && (
              <DropdownMenuItem
                onClick={handleConfirmOrder}
                className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300 rounded-md group transition-colors"
              >
                <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 p-1 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/30 transition-colors">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <span className="text-emerald-600 dark:text-emerald-400">Xác nhận đơn</span>
              </DropdownMenuItem>
            )}

            {canDeliver && (
              <DropdownMenuItem
                onClick={handleCompleteOrder}
                className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300 rounded-md group transition-colors"
              >
                <div className="rounded-full bg-amber-50 dark:bg-amber-900/30 p-1 group-hover:bg-amber-100 dark:group-hover:bg-amber-800/30 transition-colors">
                  <PackageCheck className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                </div>
                <span className="text-amber-600 dark:text-amber-400">Hoàn thành đơn</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={handleViewInvoice}
              className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-300 rounded-md group transition-colors"
            >
              <div className="rounded-full bg-purple-50 dark:bg-purple-900/30 p-1 group-hover:bg-purple-100 dark:group-hover:bg-purple-800/30 transition-colors">
                <FileText className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              </div>
              <span className="text-purple-600 dark:text-purple-400">Xem hóa đơn</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-slate-100/70 dark:bg-slate-800/30" />

            {canCancel && (
              <DropdownMenuItem
                onClick={handleCancelOrder}
                className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-300 rounded-md group transition-colors"
              >
                <div className="rounded-full bg-orange-50 dark:bg-orange-900/30 p-1 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/30 transition-colors">
                  <AlertCircle className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                </div>
                <span className="text-orange-600 dark:text-orange-400">Hủy đơn hàng</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                setCurrentOrder(order);
                setOpen("delete");
              }}
              className="cursor-pointer flex items-center gap-2 py-1.5 px-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-300 rounded-md group transition-colors"
            >
              <div className="rounded-full bg-red-50 dark:bg-red-900/30 p-1 group-hover:bg-red-100 dark:group-hover:bg-red-800/30 transition-colors">
                <Trash className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
              </div>
              <span className="text-red-600 dark:text-red-400">Xóa đơn hàng</span>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
