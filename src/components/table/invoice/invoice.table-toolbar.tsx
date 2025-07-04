import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceStatus } from "@/data/enum";
import { InvoiceResponse } from "@/data/interfaces";
import { useExportExcel } from "@/hooks";
import { Table } from "@tanstack/react-table";
import { Ban, CheckCircle2, Clock, FileDown, RotateCcw, Search, X } from "lucide-react";
import { motion } from 'motion/react';
import { useCallback, useState } from "react";
import { InvoiceDataTableFacetedFilter } from "./invoice.data-table-faceted-filter";

interface InvoiceTableToolbarProps {
  table: Table<InvoiceResponse>
  searchTerm: string
  onSearchChange: (search: string) => void
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  onResetFilters?: () => void;
}

export function InvoiceTableToolbar({ table, searchTerm, onSearchChange, filters, onFiltersChange, onResetFilters }: InvoiceTableToolbarProps) {
  const exportInvoiceExcel = useExportExcel();
  const [inputValue, setInputValue] = useState(searchTerm);
  const isFiltered = (filters?.status || searchTerm !== '');

  const handleExportExcel = useCallback(() => {
    exportInvoiceExcel.mutate('invoices');
  }, [exportInvoiceExcel]);

  const handleClearFilters = useCallback(() => {
    table.resetColumnFilters();
    setInputValue('');
    onSearchChange('');
    onResetFilters?.();
  }, [table, onSearchChange, onResetFilters]);

  const handleFilterChange = useCallback((filterKey: string, value: string | null) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [filterKey]: value === "all" ? "" : value || ""
      });
    }
  }, [filters, onFiltersChange]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue);
    }
  };

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
            placeholder="Tìm kiếm hóa đơn (nhấn Enter)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-9 h-10 shadow-none bg-emerald-50/50 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800/40 rounded-lg focus-visible:ring-emerald-500"
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
          {table.getColumn("status") && (
            <InvoiceDataTableFacetedFilter
              column={table.getColumn("status")}
              title="Trạng thái"
              options={[{
                label: "Đã thanh toán",
                value: InvoiceStatus.PAID,
                icon: CheckCircle2,
                color: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400",
              }, {
                label: "Chờ thanh toán",
                value: InvoiceStatus.PENDING,
                icon: Clock,
                color: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400",
              }, {
                label: "Đã hủy",
                value: InvoiceStatus.CANCELLED,
                icon: Ban,
                color: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400",
              }, {
                label: "Đã hoàn tiền",
                value: InvoiceStatus.REFUNDED,
                icon: RotateCcw,
                color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400",
              }]}
              onValueChange={(value) => handleFilterChange("status", value)}
              value={filters?.status || "all"}
            />
          )}
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
          onClick={handleExportExcel}
          disabled={exportInvoiceExcel.isPending}
        >
          {exportInvoiceExcel.isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xuất...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Xuất Excel
            </>
          )}
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </motion.div>
  )
}