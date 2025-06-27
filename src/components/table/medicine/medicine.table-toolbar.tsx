import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MedicineResponse } from "@/data/interfaces";
import { Table } from "@tanstack/react-table";
import { FileDown, RotateCcw, Search, X } from "lucide-react";
import { motion } from 'motion/react';
import { useState } from "react";

interface MedicineTableToolbarProps {
  table: Table<MedicineResponse>;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export function MedicineTableToolbar({ table, searchTerm, onSearchChange }: MedicineTableToolbarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm !== "";

  const handleClearFilters = () => {
    table.resetColumnFilters();
    onSearchChange('');
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue);
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-rose-100 dark:border-rose-800/30"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fuchsia-500 dark:text-fuchsia-400" />
          <Input
            placeholder="Tìm kiếm thuốc (nhấn Enter)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-9 h-10 shadow-none bg-fuchsia-50/50 dark:bg-slate-900 border border-fuchsia-100 dark:border-fuchsia-800/40 rounded-lg focus-visible:ring-fuchsia-500"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-fuchsia-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 rounded-full"
              onClick={handleClearSearch}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* {table.getColumn("status") && (
            <OrderDataTableFacetedFilter
              column={table.getColumn("status")}
              title="Trạng thái"
              options={[
                { label: "Đang xử lý", value: OrderStatus.PROCESSING },
                { label: "Đã hoàn thành", value: OrderStatus.COMPLETED },
                { label: "Đã hủy", value: OrderStatus.CANCELLED },
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
              className="h-10 px-3 text-fuchsia-700 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}

        <Button
          variant="outline"
          className="h-10 border-fuchsia-200 dark:border-fuchsia-800/40 bg-white dark:bg-slate-900 text-fuchsia-700 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20"
        >
          <FileDown className="h-4 w-4 mr-2" />
          <span>Xuất Excel</span>
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </motion.div>
  )
}