import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListParams } from "@/data/interfaces";
import { Paginated } from "@/data/sro";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import * as React from "react";
import { useInView } from "react-intersection-observer";

interface SearchableInfiniteSelectProps<T = unknown> {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSelectItem?: (item: T) => void; // Callback khi chọn item
  queryKey: string[];
  queryFn: (params?: ListParams) => Promise<Paginated<T>>;
  renderItem: (item: T) => React.ReactNode;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  className?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  disabled?: boolean;
}

export function SearchableInfiniteSelect<T = unknown>({
  placeholder = "Chọn...",
  value,
  onValueChange,
  onSelectItem,
  queryKey,
  queryFn,
  renderItem,
  getItemId,
  getItemLabel,
  className,
  searchPlaceholder = "Tìm kiếm...",
  pageSize = 20,
  disabled = false,
}: SearchableInfiniteSelectProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  
  // Refs
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout>();
  
  // Intersection observer ref for infinite scroll
  const { ref: loadMoreRef, inView } = useInView();

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [...queryKey, searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      queryFn({
        page: pageParam,
        limit: pageSize,
        s: searchTerm || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.lastPage
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten data với safe checks
  const items = data?.pages?.flatMap(page => page?.data || []) ?? [];

  // Auto-fetch more when scrolled to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Focus search input when opened
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Delay để đảm bảo content đã render
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Debounced search effect
  React.useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setHighlightedIndex(-1); // Reset highlight khi search
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue]);

  // Reset highlighted index when items change
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [items.length]);

  // Handle search when Enter is pressed
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ngăn event bubbling lên SelectContent để tránh typeahead behavior
    e.stopPropagation();
    
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchTerm(inputValue);
      return;
    }

    // Navigation keys
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < items.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : items.length - 1
      );
      return;
    }

    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedItem = items[highlightedIndex];
      if (selectedItem) {
        const itemId = getItemId(selectedItem);
        onValueChange?.(itemId);
        onSelectItem?.(selectedItem);
        setIsOpen(false);
      }
      return;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Ngăn event bubbling
    setInputValue(e.target.value);
  };

  // Handle input focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Handle input click
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Handle search button click
  const handleSearchClick = () => {
    setSearchTerm(inputValue);
  };

  // Clear search
  const handleClearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  // Handle item select
  const handleItemSelect = (itemId: string) => {
    const selectedItem = items.find(item => getItemId(item) === itemId);
    onValueChange?.(itemId);
    if (selectedItem && onSelectItem) {
      onSelectItem(selectedItem);
    }
    setIsOpen(false);
  };

  // Find selected item
  const selectedItem = items.find(item => getItemId(item) === value);

  return (
    <Select 
      onValueChange={handleItemSelect} 
      value={value} 
      disabled={disabled}
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="max-h-[400px] min-w-[350px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (inputValue) {
            e.preventDefault();
            setInputValue("");
            setSearchTerm("");
          }
        }}
        onPointerDownOutside={(e) => {
          // Allow clicking on search input without closing
          if (e.target === searchInputRef.current) {
            e.preventDefault();
          }
        }}
      >
        {/* Search Section */}
        <div 
          className="flex items-center gap-2 border-b px-3 pb-2 mb-2"
          onKeyDown={(e) => e.stopPropagation()} // Ngăn SelectContent nhận keyboard events
        >
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            className="flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {inputValue && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleSearchClick}
                className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors"
              >
                Tìm
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && items.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm">Đang tải...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center py-6 text-destructive">
            <span className="text-sm">Có lỗi xảy ra khi tải dữ liệu</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <span className="text-sm">
              {searchTerm ? "Không tìm thấy kết quả" : "Không có dữ liệu"}
            </span>
          </div>
        )}

        {/* Items List */}
        {items.length > 0 && (
          <>
            {items.map((item, index) => {
              const itemId = getItemId(item);
              const isHighlighted = index === highlightedIndex;
              
              return (
                <SelectItem 
                  key={itemId} 
                  value={itemId}
                  ref={(el) => {
                    if (el) {
                      itemRefs.current.set(itemId, el);
                    } else {
                      itemRefs.current.delete(itemId);
                    }
                  }}
                  className={isHighlighted ? "bg-accent text-accent-foreground" : ""}
                >
                  {renderItem(item)}
                </SelectItem>
              );
            })}

            {/* Load More Section */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center py-2 border-t mt-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm">Đang tải thêm...</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Cuộn để tải thêm
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </SelectContent>
    </Select>
  );
} 