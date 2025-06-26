import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { OrderStatus, PaymentMethod } from "@/data/enum";
import { OrderResponse } from "@/data/interfaces";
import { cn, formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, Banknote, CalendarClock, CheckCircle2, Clock, CreditCard, Info, Mail, Package, TruckIcon, User, XCircle } from "lucide-react";
import { OrderRowActions } from "./order.row-actions";

export const orderColumns: ColumnDef<OrderResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đơn hàng" />
    ),
    accessorKey: "id",
    cell: ({ row }) => {
      const id = row.getValue("id") as string || "Không có mã đơn hàng";

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help group">
              <div className="rounded-full p-2 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/40 dark:to-rose-900/20 group-hover:from-rose-100 group-hover:to-rose-200 dark:group-hover:from-rose-800/40 dark:group-hover:to-rose-800/20 shadow-sm transition-all duration-200">
                <Package className="h-4 w-4 text-rose-500 dark:text-rose-300" />
              </div>
              <div className="line-clamp-2 text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-rose-500 dark:group-hover:text-rose-300 transition-colors">
                #{id.slice(0, 12)}...
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            sideOffset={6}
            className="p-0 max-w-md shadow-xl border border-rose-100 dark:border-rose-800/30 rounded-lg overflow-hidden animate-in zoom-in-95 duration-100"
          >
            <div className="bg-white dark:bg-gray-900">
              <div className="bg-gradient-to-r from-rose-500 to-rose-500 px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <p className="text-sm font-medium">Chi tiết mã đơn hàng</p>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-gradient-to-b from-rose-50/50 to-white dark:from-rose-950/20 dark:to-gray-900">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  #{id}
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    },
    meta: {
      className: "w-[250px] text-left",
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên khách hàng" />
    ),
    accessorKey: "user",
    cell: ({ row }) => {
      const getImageUrl = (url: string | undefined) => {
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('./')) return url.replace('./', '/');
        if (url.startsWith('avatars/')) return `/${url}`;
        return url;
      };

      return (
        <div className="flex items-center group">
          <Avatar className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/60 dark:to-rose-900/60 flex items-center justify-center mr-3 group-hover:shadow-md transition-all duration-300 border border-rose-100/50 dark:border-rose-800/30">
            <AvatarImage src={getImageUrl(row.original.user.profileImage.url)} alt={row.original.user.profileImage.alt} className="rounded-xl object-cover" />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/60 dark:to-rose-800/60">
              <User className="h-5 w-5 text-rose-500 dark:text-rose-300" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="truncate max-w-[180px] font-semibold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-rose-500 dark:group-hover:text-rose-300">
              {row.original.user.firstname} {row.original.user.lastname}
            </span>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
                <User className="h-3 w-3 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                <span className="truncate">{row.original.user.username}</span>
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400 flex-shrink-0" />
                <span>{row.original.user.email}</span>
              </span>
            </div>
          </div>
        </div>)
    },
    meta: {
      className: "w-[250px] text-left",
    },
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày đặt hàng" />
    ),
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string || "Không có ngày đặt hàng";
      const orderDate = new Date(createdAt);

      return (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="rounded-full w-5 h-5 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/40 dark:to-rose-900/20 flex items-center justify-center">
              <CalendarClock className="h-3 w-3 text-rose-500 dark:text-rose-300" />
            </div>
            {format(orderDate, "dd/MM/yyyy", { locale: vi })}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 ml-6">
            <Clock className="h-2.5 w-2.5 text-slate-400" />
            {format(orderDate, "HH:mm", { locale: vi })}
          </div>
        </div>
      );
    },
    meta: {
      className: "w-[140px] text-left",
    },
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus || OrderStatus.PENDING;

      const getStatusDisplay = (status: OrderStatus): string => {
        switch (status) {
          case OrderStatus.PENDING:
            return "Chờ xử lý";
          case OrderStatus.PROCESSING:
            return "Đang xử lý";
          case OrderStatus.SHIPPED:
            return "Đang giao hàng";
          case OrderStatus.DELIVERED:
            return "Đã giao hàng";
          case OrderStatus.CANCELLED:
            return "Đã hủy";
          case OrderStatus.COMPLETED:
            return "Hoàn thành";
          default:
            return "Không xác định";
        }
      };

      const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
          case OrderStatus.PENDING:
            return {
              color: "bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-600 border-amber-200/50 dark:from-yellow-900/20 dark:to-amber-800/20 dark:text-amber-300 dark:border-amber-700/30",
              icon: <Clock className="h-3.5 w-3.5 mr-1" />
            };
          case OrderStatus.PROCESSING:
            return {
              color: "bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-600 border-blue-200/50 dark:from-blue-900/20 dark:to-indigo-800/20 dark:text-blue-300 dark:border-blue-700/30",
              icon: <Clock className="h-3.5 w-3.5 mr-1" />
            };
          case OrderStatus.SHIPPED:
            return {
              color: "bg-gradient-to-r from-indigo-50 to-purple-100 text-indigo-600 border-indigo-200/50 dark:from-indigo-900/20 dark:to-purple-800/20 dark:text-indigo-300 dark:border-indigo-700/30",
              icon: <TruckIcon className="h-3.5 w-3.5 mr-1" />
            };
          case OrderStatus.DELIVERED:
            return {
              color: "bg-gradient-to-r from-teal-50 to-emerald-100 text-emerald-600 border-emerald-200/50 dark:from-teal-900/20 dark:to-emerald-800/20 dark:text-emerald-300 dark:border-emerald-700/30",
              icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            };
          case OrderStatus.COMPLETED:
            return {
              color: "bg-gradient-to-r from-green-50 to-teal-100 text-teal-600 border-teal-200/50 dark:from-green-900/20 dark:to-teal-800/20 dark:text-teal-300 dark:border-teal-700/30",
              icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            };
          case OrderStatus.CANCELLED:
            return {
              color: "bg-gradient-to-r from-red-50 to-rose-100 text-rose-600 border-rose-200/50 dark:from-red-900/20 dark:to-rose-800/20 dark:text-rose-300 dark:border-rose-700/30",
              icon: <XCircle className="h-3.5 w-3.5 mr-1" />
            };
          default:
            return {
              color: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200/50 dark:from-slate-800/30 dark:to-slate-700/30 dark:text-slate-300 dark:border-slate-600/30",
              icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
            };
        }
      };

      const { color, icon } = getStatusConfig(status);
      const displayText = getStatusDisplay(status);

      return (
        <Badge variant="outline" className={cn(`flex items-center justify-center py-1.5 px-3 text-xs font-medium border shadow-sm`, color)}>
          {icon}
          <span className="line-clamp-1">{displayText}</span>
        </Badge>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng tiền" />
    ),
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number || 0;
      const paymentMethod = row.original.paymentMethod as PaymentMethod || PaymentMethod.COD;

      const getPaymentConfig = (method: PaymentMethod) => {
        switch (method) {
          case PaymentMethod.COD:
            return {
              text: "Thanh toán khi nhận hàng",
              color: "border-amber-200/50 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-600 dark:border-amber-800/30 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300",
              icon: <Banknote className="h-3 w-3 mr-1" />
            };
          case PaymentMethod.CREDIT_CARD:
            return {
              text: "Thẻ tín dụng",
              color: "border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-600 dark:border-blue-800/30 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300",
              icon: <CreditCard className="h-3 w-3 mr-1" />
            };
          case PaymentMethod.BANK_TRANSFER:
            return {
              text: "Chuyển khoản",
              color: "border-teal-200/50 bg-gradient-to-r from-teal-50 to-green-100 text-teal-600 dark:border-teal-800/30 dark:from-teal-900/20 dark:to-green-900/20 dark:text-teal-300",
              icon: <CheckCircle2 className="h-3 w-3 mr-1" />
            };
          default:
            return {
              text: "Không xác định",
              color: "border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 dark:border-slate-700/30 dark:from-slate-800/30 dark:to-slate-700/30 dark:text-slate-300",
              icon: <AlertCircle className="h-3 w-3 mr-1" />
            };
        }
      };

      const { text, color, icon } = getPaymentConfig(paymentMethod);

      return (
        <div className="flex flex-col items-end justify-center">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-gradient-to-r from-rose-500 to-rose-500 bg-clip-text text-transparent">
            {formatCurrency(totalPrice)}
          </div>
          <div className="text-xs mt-1.5">
            <Badge variant="outline" className={cn("px-2 py-0.5 shadow-sm", color)}>
              {icon}
              <span className="line-clamp-1">{text}</span>
            </Badge>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: OrderRowActions,
    meta: {
      className: "text-right pr-4",
    },
  },
];