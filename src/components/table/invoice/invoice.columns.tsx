import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceStatus, PaymentMethod } from "@/data/enum";
import { InvoiceResponse } from "@/data/interfaces";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InvoiceRowActions } from "./invoice.row-actions";

export const invoiceColumns: ColumnDef<InvoiceResponse>[] = [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã hóa đơn" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-emerald-700 dark:text-emerald-400">
        {row.getValue("invoiceNumber")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đơn hàng" />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-normal text-gray-600 dark:text-gray-400 max-w-[180px] truncate">
        {row.getValue("orderId")}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng tiền" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-emerald-800 dark:text-emerald-300">
        {formatCurrency(row.getValue("totalPrice"))}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phương thức thanh toán" />
    ),
    cell: ({ row }) => {
      const paymentMethod: PaymentMethod = row.getValue("paymentMethod");
      const label = getPaymentMethodLabel(paymentMethod);

      return (
        <div className="text-gray-700 dark:text-gray-300">
          {label}
        </div>
      );
    },
    meta: {
      className: "w-[240px]",
    },
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status: InvoiceStatus = row.getValue("status");

      return (
        <Badge
          variant="outline"
          className={getStatusStyle(status)}
        >
          {getStatusLabel(status)}
        </Badge>
      );
    },
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "issuedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày hóa đơn" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("issuedAt"));
      return (
        <div className="text-gray-700 dark:text-gray-300">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: InvoiceRowActions,
    size: 60,
    enableSorting: false,
  }
  
]

function getStatusStyle(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40 min-w-[120px] justify-center";
    case InvoiceStatus.PENDING:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40 min-w-[120px] justify-center";
    case InvoiceStatus.CANCELLED:
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/40 min-w-[120px] justify-center";
    case InvoiceStatus.REFUNDED:
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40 min-w-[120px] justify-center";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 min-w-[120px] justify-center";
  }
}

function getStatusLabel(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.PAID:
      return "Đã thanh toán";
    case InvoiceStatus.PENDING:
      return "Chờ thanh toán";
    case InvoiceStatus.CANCELLED:
      return "Đã hủy";
    case InvoiceStatus.REFUNDED:
      return "Đã hoàn tiền";
    default:
      return status;
  }
}

function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return "Thẻ tín dụng";
    case PaymentMethod.BANK_TRANSFER:
      return "Chuyển khoản";
    case PaymentMethod.COD:
      return "Thanh toán khi nhận hàng";
    default:
      return "Khác";
  }
} 