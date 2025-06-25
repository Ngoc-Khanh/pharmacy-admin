import { ListParams } from "@/data/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface UseTableOptions<T, S = T> {
  queryKey: string;
  dataFetcher: (params: ListParams) => Promise<{
    data: T[];
    total: number;
    lastPage: number;
    currentPage: number;
  }>;
  statsFetcher?: () => Promise<S>;
  enabled?: boolean;
  defaultLimit?: number;
}

export function useTable<T, S = T>({ 
  queryKey, 
  dataFetcher, 
  statsFetcher, 
  enabled = true,
  defaultLimit = 10 
}: UseTableOptions<T, S>) {
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

  // Function để update URL params
  const updateUrlParams = useCallback((params: { 
    page?: number; 
    limit?: number; 
    search?: string;
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
    
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
    navigate(newUrl, { replace: params.replace ?? true });
  }, [searchParams, location.pathname, navigate, defaultLimit]);

  // Main data query với URL params
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit,
    ...(searchTerm && { s: searchTerm })
  }), [currentPage, limit, searchTerm]);

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
      queryParams
    }
  };
}