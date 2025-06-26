import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SupplierResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Mail, Phone, Building2, MapPin } from "lucide-react";
import { SupplierRowActions } from "./suppiler.row-actions";

export const supplierColumns: ColumnDef<SupplierResponse>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nhà cung cấp" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-900/60 flex items-center justify-center mr-3 group-hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-800/30 overflow-hidden group-hover:scale-105">
          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 transform group-hover:rotate-12 transition-all" />
        </div>
        <div className="flex flex-col">
          <span className="truncate max-w-[250px] font-semibold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {row.getValue("name") || "Nhà cung cấp chưa có tên"}
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-xs text-muted-foreground truncate max-w-[250px] flex items-center gap-1">
              <MapPin className="h-3 w-3 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span className="truncate">{row.original.address || "Chưa có địa chỉ"}</span>
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[250px] flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400 flex-shrink-0" />
              <span>{row.original.updatedAt
                ? format(new Date(row.original.updatedAt), "'Cập nhật:' dd MMM yyyy", { locale: vi })
                : 'Chưa cập nhật'}</span>
            </span>
          </div>
        </div>
      </div>
    ),
    meta: {
      className: "w-[420px] text-left",
    },
    enableHiding: false,
  },
  {
    accessorKey: "contactPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge variant="outline" className={cn(
          "bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors",
          "border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-300",
          "flex items-center gap-1.5 py-1 px-2.5 font-normal"
        )}>
          <Phone className="h-3 w-3 text-emerald-500" />
          <span className="text-xs">
            {row.original.contactPhone || "Chưa cung cấp"}
          </span>
        </Badge>
      </div>
    ),
    size: 150,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "contactEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge variant="outline" className={cn(
          "bg-transparent hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors",
          "border-orange-200 dark:border-orange-800/60 text-slate-700 dark:text-slate-300",
          "flex items-center gap-1.5 py-1 px-2.5 font-normal"
        )}>
          <Mail className="h-3 w-3 text-orange-500" />
          <span className="text-xs truncate max-w-[180px]">
            {row.original.contactEmail || "Chưa cung cấp"}
          </span>
        </Badge>
      </div>
    ),
    size: 200,
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tham gia" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge variant="outline" className={cn(
          "bg-transparent hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors",
          "border-violet-200 dark:border-violet-800 text-slate-700 dark:text-slate-300",
          "flex items-center gap-1.5 py-1 px-2.5 font-normal"
        )}>
          <Calendar className="h-3 w-3 text-violet-500" />
          <span className="text-xs">
            {row.original.createdAt
              ? format(new Date(row.original.createdAt), 'dd MMM yyyy', { locale: vi })
              : 'Không rõ'}
          </span>
        </Badge>
      </div>
    ),
    size: 120,
  },
  {
    id: "actions",
    cell: SupplierRowActions,
    size: 60,
    enableSorting: false,
  },
]