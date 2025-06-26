import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderResponse, PaginationProps } from "@/data/interfaces";
import { fadeInUpVariants } from "@/lib/motion-vartiant";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { motion, Variants } from 'motion/react';
import { useState } from "react";
import { OrderTableToolbar } from "./order.table-toolbar";

interface DataTableProps {
  columns: ColumnDef<OrderResponse>[];
  data: OrderResponse[];
  searchTerm: string;
  onSearchChange: (search: string) => void;
  isLoading: boolean;
  isChangingPage?: boolean;
  pagination?: PaginationProps;
}

export function OrderDataTable({
  columns,
  data,
  searchTerm,
  onSearchChange,
  isLoading,
  isChangingPage = false,
  pagination,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // Disable internal pagination if external pagination is provided
    manualPagination: !!pagination,
  });

  return (
    <div className="space-y-4">
      <OrderTableToolbar
        table={table}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-rose-100 dark:border-rose-800/30 shadow-sm p-2">
        {pagination ? (
          <DataTablePagination
            table={table}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
          />
        ) : (
          <DataTablePagination table={table} />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-rose-100 dark:border-rose-800/30 bg-white dark:bg-slate-950 shadow-sm">
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Loading overlay */}
          {(isLoading || isChangingPage) && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 z-20 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-rose-600 dark:text-rose-400 text-sm font-medium">
                  Đang tải...
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-rose-50/80 dark:bg-rose-950/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-rose-100 dark:border-rose-800/20">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            "h-11 font-medium text-rose-800 dark:text-rose-300 text-sm px-4 py-3 text-left",
                            header.column.columnDef.meta?.className
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length > 0 ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUpVariants as Variants}
                      className="group border-b border-rose-50 dark:border-rose-800/10 hover:bg-rose-50/70 dark:hover:bg-rose-900/20 data-[state=selected]:bg-rose-100 dark:data-[state=selected]:bg-rose-800/30 transition-colors"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "h-14 px-4 py-3 align-middle text-left",
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="text-sm">
                          {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Không có đơn hàng nào."}
                        </span>
                        {searchTerm && (
                          <span className="text-xs opacity-75">
                            Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}