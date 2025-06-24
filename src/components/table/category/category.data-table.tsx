import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowData, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { motion, Variants } from 'motion/react';
import { useState } from "react";
import { CategoriesTableToolbar } from "./category.table-toolbar";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface DataTableProps {
  columns: ColumnDef<CategoryResponse>[]
  data: CategoryResponse[]
}

export function CategoryDataTable({ columns, data }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, value) => {
      const search = value.toLowerCase();
      const title = row.original.title?.toLowerCase() || '';
      const description = row.original.description?.toLowerCase() || '';
      const slug = row.original.slug?.toLowerCase() || '';

      return title.includes(search) ||
        description.includes(search) ||
        slug.includes(search);
    },
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
      <CategoriesTableToolbar table={table} />

      <div className="overflow-hidden rounded-xl border border-amber-100 dark:border-amber-800/30 bg-white dark:bg-slate-950 shadow-sm">
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader className="bg-amber-50/70 dark:bg-amber-950/40 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-amber-100 dark:border-amber-800/20">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: `${header.getSize()}px` }}
                          colSpan={header.colSpan}
                          className={cn(
                            "font-semibold text-amber-800 dark:text-amber-300 text-sm py-4 px-4",
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUpVariants as Variants}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                      className="group border-b border-amber-100 dark:border-amber-800/10 hover:bg-amber-50/70 dark:hover:bg-amber-900/20 data-[state=selected]:bg-amber-100 dark:data-[state=selected]:bg-amber-800/30 transition-colors"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: `${cell.column.getSize()}px` }}
                          className={cn(
                            "border-b border-amber-100/70 dark:border-amber-800/20 h-auto py-4 px-4 align-middle group-last:border-0",
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center px-4"
                    >
                      Không có kết quả.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-amber-100 dark:border-amber-800/30 shadow-sm p-2">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}