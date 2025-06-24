import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PaginationState, PaginationActions } from "./use-pagination";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  lastPage: number;
  currentPage: number;
}

export interface UsePaginatedDataOptions<T, S = T> {
  queryKey: (page: number, limit: number) => unknown[];
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>;
  searchQueryKey?: (searchTerm: string) => unknown[];
  searchQueryFn?: (searchTerm: string) => Promise<PaginatedResponse<T>>;
  statsQueryKey?: unknown[];
  statsQueryFn?: () => Promise<S>;
  enabled?: boolean;
}

export interface UsePaginatedDataReturn<T, S = T> {
  // Main paginated data
  data: T[];
  isLoading: boolean;
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  
  // Search data
  searchData: T[];
  isSearchLoading: boolean;
  
  // Stats data (for cards, not paginated)
  statsData: S | undefined;
  isStatsLoading: boolean;
  
  // Loading more indicator
  isLoadingMore: boolean;
  
  // Page changing indicator
  isChangingPage: boolean;
}

export function usePaginatedData<T, S = T>({
  queryKey,
  queryFn,
  searchQueryKey,
  searchQueryFn,
  statsQueryKey,
  statsQueryFn,
  enabled = true,
}: UsePaginatedDataOptions<T, S>, 
paginationState: PaginationState<T>,
paginationActions: PaginationActions<T>
): UsePaginatedDataReturn<T, S> {
  
  const { currentPage, limit, searchTerm, accumulatedData, isLoadingMore, isChangingPage } = paginationState;
  const { setAccumulatedData } = paginationActions;

  // Main paginated query
  const { data: paginatedData, isLoading } = useQuery({
    queryKey: queryKey(currentPage, limit),
    queryFn: () => queryFn(currentPage, limit),
    enabled: enabled && !searchTerm,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Search query
  const { data: searchResult, isLoading: isSearchLoading } = useQuery({
    queryKey: searchQueryKey ? searchQueryKey(searchTerm) : ["search", searchTerm],
    queryFn: () => searchQueryFn ? searchQueryFn(searchTerm) : Promise.resolve({ data: [], total: 0, lastPage: 1, currentPage: 1 }),
    enabled: !!searchTerm && !!searchQueryFn,
    staleTime: 60000, // 1 minute for search results
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Stats query (for dashboard cards)
  const { data: statsResult, isLoading: isStatsLoading } = useQuery({
    queryKey: statsQueryKey || ["stats"],
    queryFn: () => statsQueryFn ? statsQueryFn() : Promise.resolve(undefined),
    enabled: !!statsQueryFn,
    staleTime: 300000, // 5 minutes for stats
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Update accumulated data when main data changes
  useEffect(() => {
    if (paginatedData?.data && !isLoadingMore && paginatedData.data.length > 0) {
      setAccumulatedData(paginatedData.data);
    }
  }, [paginatedData?.data, isLoadingMore, setAccumulatedData]);

  // Determine which data to display
  const displayData = searchTerm 
    ? (searchResult?.data || [])
    : (isLoadingMore || accumulatedData.length > (paginatedData?.data?.length || 0)
        ? accumulatedData 
        : (paginatedData?.data || []));

  // Calculate loading state
  const isTableLoading = searchTerm 
    ? isSearchLoading 
    : (isLoading && !isLoadingMore && !accumulatedData.length);

  return {
    data: displayData,
    isLoading: isTableLoading,
    paginationInfo: {
      currentPage: paginatedData?.currentPage || currentPage,
      totalPages: paginatedData?.lastPage || 1,
      totalItems: paginatedData?.total || 0,
    },
    searchData: searchResult?.data || [],
    isSearchLoading,
    statsData: statsResult,
    isStatsLoading,
    isLoadingMore,
    isChangingPage,
  };
} 