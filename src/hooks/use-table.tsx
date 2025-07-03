import { ListParams } from "@/data/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface UseTableOptions<T, S = T, F extends Record<string, unknown> = Record<string, unknown>> {
  queryKey: string;
  dataFetcher: (params: ListParams & F) => Promise<{
    data: T[];
    total: number;
    lastPage: number;
    currentPage: number;
  }>;
  statsFetcher?: () => Promise<S>;
  enabled?: boolean;
  defaultLimit?: number;
  defaultFilters?: F;
}

export function useTable<T, S = T, F extends Record<string, unknown> = Record<string, unknown>>({ 
  queryKey, 
  dataFetcher, 
  statsFetcher, 
  enabled = true,
  defaultLimit = 10,
  defaultFilters = {} as F
}: UseTableOptions<T, S, F>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy params từ URL
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  const limit = useMemo(() => {
    const size = parseInt(searchParams.get("limit") || defaultLimit.toString(), 10);
    return isNaN(size) || size < 1 ? defaultLimit : size;
  }, [searchParams, defaultLimit]);

  const searchTerm = useMemo(() => {
    return searchParams.get("s") || "";
  }, [searchParams]);

  // Lấy filters từ URL
  const filters = useMemo(() => {
    const filterParams = {} as F;
    Object.keys(defaultFilters).forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        filterParams[key as keyof F] = value as F[keyof F];
      }
    });
    return filterParams;
  }, [searchParams, defaultFilters]);

  // Function để update URL params
  const updateUrlParams = useCallback((params: { 
    page?: number; 
    limit?: number; 
    search?: string;
    filters?: Partial<F>;
    replace?: boolean;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (params.page !== undefined) {
      if (params.page === 1) {
        newSearchParams.delete("page");
      } else {
        newSearchParams.set("page", params.page.toString());
      }
    }
    
    if (params.limit !== undefined) {
      if (params.limit === defaultLimit) {
        newSearchParams.delete("limit");
      } else {
        newSearchParams.set("limit", params.limit.toString());
      }
    }
    
    if (params.search !== undefined) {
      if (params.search.trim()) {
        newSearchParams.set("s", params.search.trim());
        // Reset về trang 1 khi search
        newSearchParams.delete("page");
      } else {
        newSearchParams.delete("s");
      }
    }
    
    // Handle filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, String(value));
        } else {
          newSearchParams.delete(key);
        }
      });
      // Reset về trang 1 khi thay đổi filters
      newSearchParams.delete("page");
    }
    
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
    navigate(newUrl, { replace: params.replace ?? true });
  }, [searchParams, location.pathname, navigate, defaultLimit]);

  // Main data query với URL params
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit,
    ...(searchTerm && { s: searchTerm }),
    ...filters // Thêm filters vào queryParams
  }), [currentPage, limit, searchTerm, filters]);

  const { 
    data: tableData, 
    isLoading, 
    refetch, 
    isFetching,
    isPlaceholderData 
  } = useQuery({
    queryKey: [queryKey, queryParams],
    queryFn: () => dataFetcher(queryParams),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (previousData) => previousData, // Giữ data cũ khi loading
  });

  // Stats query
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: [`${queryKey}-stats`],
    queryFn: statsFetcher,
    enabled: !!statsFetcher,
    staleTime: 1000 * 60 * 10, // 10 phút cho stats
    refetchOnWindowFocus: false,
  });

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    const maxPage = tableData?.lastPage || 1;
    if (page !== currentPage && page > 0 && page <= maxPage) {
      updateUrlParams({ page });
    }
  }, [currentPage, tableData?.lastPage, updateUrlParams]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    if (pageSize !== limit && pageSize > 0) {
      updateUrlParams({ page: 1, limit: pageSize });
    }
  }, [limit, updateUrlParams]);

  const handleSearchTermChange = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm !== searchTerm) {
      updateUrlParams({ search: trimmedTerm });
    }
  }, [searchTerm, updateUrlParams]);

  // Reset search
  const resetSearch = useCallback(() => {
    updateUrlParams({ search: "" });
  }, [updateUrlParams]);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters: Partial<F>) => {
    updateUrlParams({ filters: newFilters });
  }, [updateUrlParams]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const resetFilterParams = {} as Partial<F>;
    Object.keys(defaultFilters).forEach((key) => {
      resetFilterParams[key as keyof F] = undefined as F[keyof F];
    });
    updateUrlParams({ filters: resetFilterParams });
  }, [defaultFilters, updateUrlParams]);

  return {
    // Data
    data: tableData?.data || [],
    statsData,
    
    // Loading states - chỉ dùng của TanStack Query
    isLoading: isLoading && !tableData,
    isStatsLoading,
    isFetching: isFetching && !isPlaceholderData,
    isChangingPage: isFetching,
    
    // Pagination info
    paginationInfo: {
      currentPage: tableData?.currentPage || currentPage,
      totalPages: tableData?.lastPage || 1,
      totalItems: tableData?.total || 0,
    },
    
    // Search
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    resetSearch,
    
    // Filters
    filters,
    handleFiltersChange,
    resetFilters,
    
    // Pagination handlers
    handlePageChange,
    handlePageSizeChange,
    pageSize: limit,
    
    // Utils
    refetch,
    
    // URL params cho debugging
    _debug: {
      currentPage,
      limit,
      searchTerm,
      filters,
      queryParams
    }
  };
}