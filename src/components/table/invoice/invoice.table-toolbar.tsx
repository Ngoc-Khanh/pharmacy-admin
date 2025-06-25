import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceResponse } from "@/data/interfaces";
import { Table } from "@tanstack/react-table";
import { FileDown, RotateCcw, Search, X } from "lucide-react";
import { motion } from 'motion/react';

interface InvoiceTableToolbarProps {
  table: Table<InvoiceResponse>
  searchTerm: string
  onSearchChange: (search: string) => void
}

export function InvoiceTableToolbar({ table, searchTerm, onSearchChange }: InvoiceTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm !== '';

  const handleClearFilters = () => {
    table.resetColumnFilters();
    onSearchChange('');
  }

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-emerald-100 dark:border-emerald-800/30"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          <Input
            placeholder="Tìm kiếm hóa đơn..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
              onClick={handleClearFilters}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* {table.getColumn("status") && (
            <InvoiceDataTableFacetedFilter
              column={table.getColumn("status")}
              title="Trạng thái"
              options={[]}
            />
          )} */}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-10 px-3 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}

        <Button
          variant="outline"
          className="h-10 border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <FileDown className="h-4 w-4 mr-2" />
          <span>Xuất Excel</span>
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </motion.div>
  )
}