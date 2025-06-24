import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserResponse } from "@/data/interfaces";
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
}

export default function AccountDataTable({ columns, data, searchTerm, onSearchChange, isLoading }: DataTableProps) {
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
  });

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.25,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-4">
      <AccountTableToolbar 
        table={table} 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <div className="overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-800/30 bg-white dark:bg-slate-950 shadow-sm">
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-emerald-50/80 dark:bg-emerald-950/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-emerald-100 dark:border-emerald-800/20">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            "h-11 font-medium text-emerald-800 dark:text-emerald-300 text-sm px-4 py-3 text-left",
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
                {isLoading ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`loading-${i}`} className="border-b border-emerald-50 dark:border-emerald-800/10">
                      {columns.map((_, colIndex) => (
                        <TableCell key={`loading-cell-${i}-${colIndex}`} className="h-14 px-4 py-3">
                          <div className="animate-pulse">
                            <div className="h-4 bg-emerald-100 dark:bg-emerald-900/30 rounded"></div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUpVariants as Variants}
                      className="group border-b border-emerald-50 dark:border-emerald-800/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 data-[state=selected]:bg-emerald-100 dark:data-[state=selected]:bg-emerald-800/30 transition-colors"
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Không có người dùng nào."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm p-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}