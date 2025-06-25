import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
}: DataTablePaginationProps<TData>) {
  // Determine if we're using external pagination
  const isExternalPagination = !!(onPageChange && currentPage !== undefined && totalPages !== undefined);
  
  // Get current pagination state
  const currentPageDisplay = isExternalPagination ? currentPage : table.getState().pagination.pageIndex + 1;
  const currentPageSize = pageSize || table.getState().pagination.pageSize;
  const totalPageCount = isExternalPagination ? totalPages : table.getPageCount();
  
  // Handler for page changes that supports both internal and external pagination
  const handlePageChange = (pageIndex: number) => {
    // Validate page number
    if (pageIndex < 1 || (isExternalPagination && pageIndex > totalPages)) {
      return;
    }
    
    if (isExternalPagination && onPageChange) {
      // For external pagination (1-indexed)
      onPageChange(pageIndex);
    } else {
      // For internal pagination (0-indexed)
      const internalIndex = pageIndex - 1;
      if (internalIndex >= 0 && internalIndex < table.getPageCount()) {
        table.setPageIndex(internalIndex);
      }
    }
  };

  // Handler for page size changes
  const handlePageSizeChange = (size: number) => {
    if (size <= 0) return;
    
    if (onPageSizeChange) {
      // External page size handling - reset to page 1
      onPageSizeChange(size);
      if (onPageChange) {
        onPageChange(1);
      }
    } else {
      // Internal page size handling
      table.setPageSize(size);
    }
  };

  // Calculate pagination buttons state with better validation
  const canPreviousPage = isExternalPagination 
    ? currentPage > 1 
    : table.getCanPreviousPage();
  
  const canNextPage = isExternalPagination 
    ? currentPage < totalPages 
    : table.getCanNextPage();

  // Calculate display information
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRowsCount = isExternalPagination ? (totalItems || 0) : table.getFilteredRowModel().rows.length;

  // Calculate range for current page with better validation
  const fromItem = totalRowsCount > 0 ? (isExternalPagination 
    ? Math.min((currentPage - 1) * currentPageSize + 1, totalRowsCount)
    : Math.min(table.getState().pagination.pageIndex * currentPageSize + 1, totalRowsCount)) : 0;
  
  const toItem = totalRowsCount > 0 ? (isExternalPagination 
    ? Math.min(currentPage * currentPageSize, totalRowsCount)
    : Math.min((table.getState().pagination.pageIndex + 1) * currentPageSize, totalRowsCount)) : 0;

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {selectedRowsCount > 0 ? (
          <span>
            {selectedRowsCount} trong số {totalRowsCount} hàng được chọn.
          </span>
        ) : (
          <span>
            {totalRowsCount > 0 
              ? `Hiển thị ${fromItem}-${toItem} trong tổng số ${totalRowsCount} hàng`
              : "Không có dữ liệu"
            }
          </span>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Số hàng mỗi trang
          </span>
          <Select
            value={`${currentPageSize}`}
            onValueChange={(value) => {
              handlePageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-emerald-100 dark:border-emerald-800/40 focus:ring-emerald-500">
              <SelectValue placeholder={currentPageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[5rem]">
              {[10, 20, 30, 40, 50].map((pageSizeOption) => (
                <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                  {pageSizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
            Trang {currentPageDisplay} /{" "}
            {totalPageCount || 1}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-emerald-100 dark:border-emerald-800/40"
              onClick={() => handlePageChange(1)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Đi đến trang đầu tiên</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-emerald-100 dark:border-emerald-800/40"
              onClick={() => {
                const prevPage = Math.max(1, currentPageDisplay - 1);
                if (prevPage >= 1) {
                  handlePageChange(prevPage);
                }
              }}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Đi đến trang trước</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-emerald-100 dark:border-emerald-800/40"
              onClick={() => {
                const nextPage = Math.min(totalPageCount, currentPageDisplay + 1);
                if (nextPage <= totalPageCount) {
                  handlePageChange(nextPage);
                }
              }}
              disabled={!canNextPage}
            >
              <span className="sr-only">Đi đến trang tiếp theo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 border-emerald-100 dark:border-emerald-800/40"
              onClick={() => {
                if (totalPageCount > 0) {
                  handlePageChange(totalPageCount);
                }
              }}
              disabled={!canNextPage}
            >
              <span className="sr-only">Đi đến trang cuối cùng</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}