import { useCallback, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface PaginationState<T = unknown> {
  currentPage: number;
  limit: number;
  searchTerm: string;
  isLoadingMore: boolean;
  isChangingPage: boolean;
  accumulatedData: T[];
}

export interface PaginationActions<T = unknown> {
  setSearchTerm: (term: string) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => Promise<void>;
  setAccumulatedData: (data: T[]) => void;
  setIsLoadingMore: (loading: boolean) => void;
  setIsChangingPage: (loading: boolean) => void;
}

export interface UsePaginationOptions<T = unknown> {
  defaultLimit?: number;
  loadMoreData?: (page: number, limit: number) => Promise<{ data: T[] }>;
}

export function usePagination<T = unknown>({ 
  defaultLimit = 10, 
  loadMoreData 
}: UsePaginationOptions<T> = {}): [PaginationState<T>, PaginationActions<T>] {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryParams = new URLSearchParams(location.search);
  
  const currentPage = parseInt(queryParams.get("page") || "1", 10);
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || defaultLimit.toString(), 10));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [accumulatedData, setAccumulatedData] = useState<T[]>([]);

  // Initialize pagination controls
  useEffect(() => {
    if (!queryParams.has("page")) {
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    }
  }, [location.pathname, navigate, queryParams]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setIsChangingPage(true);
    queryParams.set("page", page.toString());
    if (limit !== defaultLimit) {
      queryParams.set("limit", limit.toString());
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    
    // Reset changing page state quickly to reduce lag
    setTimeout(() => {
      setIsChangingPage(false);
    }, 150);
  }, [location.pathname, navigate, queryParams, limit, defaultLimit]);

  // Handle page size change with smart loading
  const handlePageSizeChange = useCallback(async (pageSize: number) => {
    if (pageSize <= limit) {
      // Reducing page size - simple navigation
      setLimit(pageSize);
      queryParams.set("limit", pageSize.toString());
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
      return;
    }
    
    if (!loadMoreData) {
      // No loadMoreData function provided, fallback to navigation
      setLimit(pageSize);
      queryParams.set("limit", pageSize.toString());
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
      return;
    }
    
    // Increasing page size - smart loading
    setIsLoadingMore(true);
    
    try {
      const additionalItemsNeeded = pageSize - accumulatedData.length;
      
      if (additionalItemsNeeded <= 0) {
        // Already have enough data
        setLimit(pageSize);
        queryParams.set("limit", pageSize.toString());
        window.history.replaceState({}, '', `${location.pathname}?${queryParams.toString()}`);
        setIsLoadingMore(false);
        return;
      }
      
      const additionalPages = Math.ceil(additionalItemsNeeded / limit);
      const newData = [...accumulatedData];
      
      // Load additional pages
      for (let i = 1; i <= additionalPages; i++) {
        const nextPage = currentPage + i;
        const result = await loadMoreData(nextPage, limit);
        if (result.data && result.data.length > 0) {
          newData.push(...result.data);
          if (result.data.length < limit || newData.length >= pageSize) break;
        } else {
          break;
        }
      }
      
      setAccumulatedData(newData);
      setLimit(pageSize);
      
      queryParams.set("limit", pageSize.toString());
      window.history.replaceState({}, '', `${location.pathname}?${queryParams.toString()}`);
      
    } catch (error) {
      console.error("Error loading more data:", error);
      // Fallback to navigation
      setLimit(pageSize);
      queryParams.set("limit", pageSize.toString());
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [accumulatedData, currentPage, limit, location.pathname, navigate, queryParams, loadMoreData]);

  const state: PaginationState<T> = useMemo(() => ({
    currentPage,
    limit,
    searchTerm,
    isLoadingMore,
    isChangingPage,
    accumulatedData,
  }), [currentPage, limit, searchTerm, isLoadingMore, isChangingPage, accumulatedData]);

  const actions: PaginationActions<T> = useMemo(() => ({
    setSearchTerm,
    handlePageChange,
    handlePageSizeChange,
    setAccumulatedData,
    setIsLoadingMore,
    setIsChangingPage,
  }), [setSearchTerm, handlePageChange, handlePageSizeChange, setAccumulatedData, setIsLoadingMore, setIsChangingPage]);

  return [state, actions];
} 