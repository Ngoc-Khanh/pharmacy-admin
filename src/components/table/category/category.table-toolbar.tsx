import { DataTableViewOptions } from '@/components/table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/data/interfaces';
import { useExportExcel } from '@/hooks';
import { Table } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { FileDown, RotateCcw, Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { CategoryDataTableFacetedFilter } from './category.data-table-faceted-filter';

interface CategoriesTableToolbarProps {
  table: Table<CategoryResponse>;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export function CategoriesTableToolbar({ table, searchTerm, onSearchChange }: CategoriesTableToolbarProps) {
  const exportCategoryExcel = useExportExcel();
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // Kiểm tra có filter nào đang active không (bao gồm cả search term và column filters)
  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm.length > 0;

  const handleExportExcel = useCallback(() => {
    exportCategoryExcel.mutate('categories');
  }, [exportCategoryExcel]);

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
      className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 rounded-lg p-2 shadow-sm border border-amber-100 dark:border-amber-900/20"
    >
      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 dark:text-amber-400" />
          <Input
            placeholder="Tìm kiếm danh mục (nhấn Enter)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-9 h-10 shadow-none bg-amber-50/50 dark:bg-slate-900 border border-amber-100 dark:border-amber-800/40 rounded-lg focus-visible:ring-amber-500"
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full"
              onClick={handleClearSearch}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {table.getColumn("isActive") && (
            <CategoryDataTableFacetedFilter
              column={table.getColumn("isActive")}
              title="Trạng thái"
              options={[
                { label: "Đang hoạt động", value: true },
                { label: "Đã vô hiệu", value: false },
              ]}
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
              className="h-10 px-3 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400"
              onClick={handleClearFilters}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Xóa bộ lọc
            </Button>
          </motion.div>
        )}

        <Button
          variant="outline"
          className="h-10 border-amber-200 dark:border-amber-800/40 bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          onClick={handleExportExcel}
          disabled={exportCategoryExcel.isPending}
        >
          {exportCategoryExcel.isPending ? (
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
  );
}
