import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PaginationState, PaginationActions } from "./use-pagination";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  lastPage: number;
  currentPage: number;
}

export interface UsePaginatedDataOptions<T> {
  queryKey: (page: number, limit: number) => unknown[];
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>;
  searchQueryKey?: (searchTerm: string) => unknown[];
  searchQueryFn?: (searchTerm: string) => Promise<PaginatedResponse<T>>;
  statsQueryKey?: unknown[];
  statsQueryFn?: () => Promise<PaginatedResponse<T>>;
  enabled?: boolean;
}

export interface UsePaginatedDataReturn<T> {
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
  statsData: T[];
  isStatsLoading: boolean;
  
  // Loading more indicator
  isLoadingMore: boolean;
  
  // Page changing indicator
  isChangingPage: boolean;
}

export function usePaginatedData<T>({
  queryKey,
  queryFn,
  searchQueryKey,
  searchQueryFn,
  statsQueryKey,
  statsQueryFn,
  enabled = true,
}: UsePaginatedDataOptions<T>, 
paginationState: PaginationState<T>,
paginationActions: PaginationActions<T>
): UsePaginatedDataReturn<T> {
  
  const { currentPage, limit, searchTerm, accumulatedData, isLoadingMore, isChangingPage } = paginationState;
  const { setAccumulatedData } = paginationActions;

  // Main paginated query
  const { data: paginatedData, isLoading } = useQuery({
    queryKey: queryKey(currentPage, limit),
    queryFn: () => queryFn(currentPage, limit),
    enabled: enabled && !searchTerm,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Search query
  const { data: searchResult, isLoading: isSearchLoading } = useQuery({
    queryKey: searchQueryKey ? searchQueryKey(searchTerm) : ["search", searchTerm],
    queryFn: () => searchQueryFn ? searchQueryFn(searchTerm) : Promise.resolve({ data: [], total: 0, lastPage: 1, currentPage: 1 }),
    enabled: !!searchTerm && !!searchQueryFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Stats query (for dashboard cards)
  const { data: statsResult, isLoading: isStatsLoading } = useQuery({
    queryKey: statsQueryKey || ["stats"],
    queryFn: () => statsQueryFn ? statsQueryFn() : Promise.resolve({ data: [], total: 0, lastPage: 1, currentPage: 1 }),
    enabled: !!statsQueryFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Update accumulated data when main data changes
  useEffect(() => {
    if (paginatedData?.data && !isLoadingMore) {
      setAccumulatedData(paginatedData.data);
    }
  }, [paginatedData, isLoadingMore, setAccumulatedData]);

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
    statsData: statsResult?.data || [],
    isStatsLoading,
    isLoadingMore,
    isChangingPage,
  };
} 