import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, FileText, Info, Pill, ShieldCheck, ShieldX, Tag } from "lucide-react";
import { CategoryRowActions } from "./category.row-actions";

export const categoryColumns: ColumnDef<CategoryResponse>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên danh mục" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-950/60 dark:to-teal-900/60 flex items-center justify-center mr-3 group-hover:shadow-md transition-all duration-300 border border-teal-100 dark:border-teal-800/30">
          <Pill className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="flex flex-col">
          <span className="truncate max-w-[180px] font-semibold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">
            {row.getValue("title") || "Danh mục chưa có tên"}
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-xs text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
              <Tag className="h-3 w-3 text-teal-500 dark:text-teal-400 flex-shrink-0" />
              <span className="truncate">{row.original.slug || "N/A"}</span>
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
              <span>{row.original.updatedAt ? format(new Date(row.original.updatedAt), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}</span>
            </span>
          </div>
        </div>
      </div>
    ),
    size: 250,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string || "Không có mô tả";

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help group">
              <div className="rounded-full p-2 bg-teal-50 dark:bg-teal-900/20 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-all duration-200">
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {description}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            sideOffset={6}
            className="p-0 max-w-md shadow-xl border border-teal-100 dark:border-teal-800/30 rounded-lg overflow-hidden animate-in zoom-in-95 duration-100"
          >
            <div className="bg-white dark:bg-gray-900">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <p className="text-sm font-medium">Mô tả danh mục</p>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-gradient-to-b from-cyan-50/50 to-white dark:from-cyan-950/20 dark:to-gray-900">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
    size: 240,
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Trạng thái" />
      </div>
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive !== false; // If undefined, treat as active

      return (
        <div className="flex items-center justify-center w-full">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm",
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            )}
          >
            {isActive ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Đang hoạt động</span>
              </>
            ) : (
              <>
                <ShieldX className="h-3.5 w-3.5" />
                <span>Đã vô hiệu</span>
              </>
            )}
          </Badge>
        </div>
      );
    },
    filterFn: (row, value) => {
      const rowValue = row.original.isActive !== false;
      return value.includes(rowValue.toString());
    },
    size: 160,
    enableSorting: false,
    meta: {
      className: "text-center",
    },
  },
  {
    id: "actions",
    cell: CategoryRowActions,
    meta: {
      className: "text-right pr-4",
    },
    size: 80,
  },
]