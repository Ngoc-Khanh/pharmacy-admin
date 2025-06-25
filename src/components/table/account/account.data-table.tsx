import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationProps, UserResponse, UserStatsResponse } from "@/data/interfaces";
import { fadeInUpVariants } from "@/lib/motion-vartiant";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowData, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { motion, Variants } from 'motion/react';
import { useState } from "react";
import { AccountTableToolbar } from "./account.table-toolbar";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface DataTableProps {
  columns: ColumnDef<UserResponse>[];
  data: UserResponse[];
  searchTerm: string;
  onSearchChange: (search: string) => void;
  isLoading: boolean;
  isChangingPage?: boolean;
  pagination?: PaginationProps;
  onBulkDelete?: (selectedAccounts: UserResponse[]) => void;
  statsData?: UserStatsResponse;
}

export default function AccountDataTable({
  columns,
  data,
  searchTerm,
  onSearchChange,
  isLoading,
  isChangingPage = false,
  pagination,
  onBulkDelete,
  statsData
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
    manualPagination: !!pagination,
  });

  return (
    <div className="space-y-4">
      <AccountTableToolbar
        table={table}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onBulkDelete={onBulkDelete}
        statsData={statsData}
      />

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-cyan-100 dark:border-cyan-800/30 shadow-sm p-2">
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

      <div className="overflow-hidden rounded-xl border border-cyan-100 dark:border-cyan-800/30 bg-white dark:bg-slate-950 shadow-sm">
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Loading overlay đơn giản */}
          {(isLoading || isChangingPage) && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 z-20 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                  Đang tải...
                </span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-cyan-50/80 dark:bg-cyan-950/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-cyan-100 dark:border-cyan-800/20">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            "h-11 font-medium text-cyan-800 dark:text-cyan-300 text-sm px-4 py-3 text-left",
                            header.column.id === "select" && "w-[50px]",
                            header.column.id === "profileImage" && "w-[80px]",
                            header.column.id === "fullname" && "w-[200px]",
                            header.column.id === "email" && "w-[250px]",
                            header.column.id === "phone" && "w-[140px]",
                            header.column.id === "addresses" && "w-[120px]",
                            header.column.id === "status" && "w-[120px]",
                            header.column.id === "role" && "w-[150px]",
                            header.column.id === "actions" && "w-[80px] text-right",
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
                      className="group border-b border-cyan-50 dark:border-cyan-800/10 hover:bg-cyan-50/70 dark:hover:bg-cyan-900/20 data-[state=selected]:bg-cyan-100 dark:data-[state=selected]:bg-cyan-800/30 transition-colors"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "h-14 px-4 py-3 align-middle text-left",
                            cell.column.id === "select" && "w-[50px]",
                            cell.column.id === "profileImage" && "w-[80px] text-center",
                            cell.column.id === "fullname" && "w-[200px]",
                            cell.column.id === "email" && "w-[250px]",
                            cell.column.id === "phone" && "w-[140px]",
                            cell.column.id === "addresses" && "w-[120px] text-center",
                            cell.column.id === "status" && "w-[120px] text-center",
                            cell.column.id === "role" && "w-[150px] text-center",
                            cell.column.id === "actions" && "w-[80px] text-right"
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
                          {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Không có người dùng nào."}
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
  )
}