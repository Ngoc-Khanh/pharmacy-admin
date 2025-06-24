import { AccountDataTableFacetedFilter } from "@/components/table/account/account.data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountStatus } from "@/data/enum";
import { UserResponse } from "@/data/interfaces";
import { Table } from "@tanstack/react-table";
import { FileDown, RotateCcw, Search, X } from "lucide-react";
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from "react";
import { userTypes } from ".";

interface AccountTableToolbarProps {
  table: Table<UserResponse>;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export function AccountTableToolbar({ table, searchTerm, onSearchChange }: AccountTableToolbarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm !== '';

  // Debounce search API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  // Sync với external search term
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
  }, [onSearchChange]);

  const handleClearFilters = useCallback(() => {
    table.resetColumnFilters();
    setLocalSearchTerm('');
    onSearchChange('');
  }, [table, onSearchChange]);

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-emerald-100 dark:border-emerald-900/20"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          <Input
            placeholder="Tìm kiếm tài khoản theo tên, email, username..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-9 h-10 shadow-none bg-emerald-50/50 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800/40 rounded-lg focus-visible:ring-emerald-500"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full"
              onClick={handleClearSearch}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {table.getColumn("status") && (
            <AccountDataTableFacetedFilter
              column={table.getColumn("status")}
              title="Trạng thái"
              options={[
                { label: "Hoạt động", value: AccountStatus.ACTIVE },
                { label: "Chờ xác thực", value: AccountStatus.PENDING },
                { label: "Không hoạt động", value: AccountStatus.SUSPENDED },
              ]}
            />
          )}

          {table.getColumn("role") && (
            <AccountDataTableFacetedFilter
              column={table.getColumn("role")}
              title="Vai trò"
              options={userTypes.map((t) => ({ ...t }))}
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
              className="h-10 px-3 text-emerald-700 dark:text-emerald-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400"
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