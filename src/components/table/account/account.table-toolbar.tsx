import { AccountDataTableFacetedFilter } from "@/components/table/account/account.data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountRole, AccountStatus } from "@/data/enum";
import { UserResponse, UserStatsResponse } from "@/data/interfaces";
import { useExportExcel } from "@/hooks";
import { Table } from "@tanstack/react-table";
import { FileDown, RotateCcw, Search, Trash2, X } from "lucide-react";
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from "react";
import { userTypes } from ".";

interface AccountTableToolbarProps {
  table: Table<UserResponse>;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onBulkDelete?: (selectedAccounts: UserResponse[]) => void;
  statsData?: UserStatsResponse;
}

export function AccountTableToolbar({
  table,
  searchTerm,
  onSearchChange,
  onBulkDelete,
  statsData
}: AccountTableToolbarProps) {
  const exportAccountExcel = useExportExcel();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm !== '';
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  // Debounce search API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const handleExportExcel = useCallback(() => {
    exportAccountExcel.mutate('users');
  }, [exportAccountExcel]);

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

  const handleBulkDelete = useCallback(() => {
    const selectedAccounts = selectedRows.map(row => row.original);
    onBulkDelete?.(selectedAccounts);
  }, [selectedRows, onBulkDelete]);

  return (
    <motion.div
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-cyan-100 dark:border-cyan-900/20"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        {/* Bulk Delete Button - chỉ hiển thị khi có rows được chọn */}
        {hasSelectedRows && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="destructive"
              size="sm"
              className="h-10 px-3 bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={handleBulkDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa {selectedRows.length} tài khoản
            </Button>
          </motion.div>
        )}

        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          <Input
            placeholder="Tìm kiếm tài khoản theo tên, email, username..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-9 h-10 shadow-none bg-cyan-50/50 dark:bg-slate-900 border border-cyan-100 dark:border-cyan-800/40 rounded-lg focus-visible:ring-cyan-500"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-full"
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
                {
                  label: "Hoạt động",
                  value: AccountStatus.ACTIVE,
                  count: statsData?.activeUsers ?? 0
                },
                {
                  label: "Chờ xác thực",
                  value: AccountStatus.PENDING,
                  count: statsData?.pendingUsers ?? 0
                },
                {
                  label: "Không hoạt động",
                  value: AccountStatus.SUSPENDED,
                  count: statsData?.suspendedUsers ?? 0
                },
              ]}
            />
          )}

          {table.getColumn("role") && (
            <AccountDataTableFacetedFilter
              column={table.getColumn("role")}
              title="Vai trò"
              options={userTypes.map((t) => ({
                ...t,
                count: t.value === AccountRole.ADMIN ? (statsData?.adminAccounts ?? 0) :
                  t.value === AccountRole.PHARMACIST ? (statsData?.pharmacistAccounts ?? 0) :
                    t.value === AccountRole.CUSTOMER ? (statsData?.customerAccounts ?? 0) : 0
              }))}
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
              className="h-10 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}

        <Button
          variant="outline"
          className="h-10 border-cyan-200 dark:border-cyan-800/40 bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          onClick={handleExportExcel}
          disabled={exportAccountExcel.isPending}
        >
          {exportAccountExcel.isPending ? (
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