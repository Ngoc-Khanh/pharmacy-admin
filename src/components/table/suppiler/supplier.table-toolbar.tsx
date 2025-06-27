import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupplierStatsResponse } from "@/data/interfaces";
import { Table } from "@tanstack/react-table";
import { FileDown, RotateCcw, Search, X } from "lucide-react";
import { motion } from 'motion/react';

interface SupplierTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  statsData?: SupplierStatsResponse;
}

export function SupplierTableToolbar<TData>({ 
  table, 
  searchTerm, 
  onSearchChange,
}: SupplierTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm !== "";

  const handleClearFilters = () => {
    table.resetColumnFilters();
    onSearchChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-violet-100 dark:border-violet-800/30"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500 dark:text-violet-400" />
          <Input
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 h-10 shadow-none bg-violet-50/50 dark:bg-slate-900 border border-violet-100 dark:border-violet-800/40 rounded-lg focus-visible:ring-violet-500"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-full"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* {table.getColumn("isActive") && (
            <CategoryDataTableFacetedFilter
              column={table.getColumn("isActive")}
              title="Trạng thái"
              options={[
                { label: "Đang hoạt động", value: true },
                { label: "Đã vô hiệu", value: false },
              ]}
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
              className="h-10 px-3 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400"
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />bu
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}

        <Button
          variant="outline"
          className="h-10 border-violet-200 dark:border-violet-800/40 bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
        >
          <FileDown className="h-4 w-4 mr-2" />
          <span>Xuất Excel</span>
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </motion.div>
  )
}