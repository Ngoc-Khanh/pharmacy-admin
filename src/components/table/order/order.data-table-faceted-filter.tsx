import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { CheckIcon, Filter, PlusCircle } from "lucide-react";

interface OrderDataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string | boolean;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    count?: number; // Tổng số từ toàn bộ data
  }[];
  onValueChange?: (value: string | null) => void;
  value?: string;
}

export function OrderDataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  onValueChange,
  value = "all"
}: OrderDataTableFacetedFilterProps<TData, TValue>) {
  const isValueSelected = value !== "all";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-9 border-rose-200 dark:border-rose-800/40 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-200 px-3 shadow-sm",
            isValueSelected ? "border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400" : "border-dashed"
          )}
        >
          {isValueSelected ? (
            <Filter className="h-3.5 w-3.5 mr-2 text-rose-500 dark:text-rose-400" />
          ) : (
            <PlusCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{title}</span>
          {isValueSelected && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 bg-rose-200 dark:bg-rose-800/60" />
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => option.value.toString() === value)
                  .map((option) => (
                    <Badge
                      variant="outline"
                      key={option.value.toString()}
                      className={cn(
                        "rounded-md px-1.5 py-0 text-xs font-medium flex items-center gap-1",
                        option.color || "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50"
                      )}
                    >
                      {option.icon && <option.icon className="h-3 w-3" />}
                      {option.label}
                    </Badge>
                  ))
                }
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[220px] p-0 border-rose-100 dark:border-rose-800/40 shadow-lg rounded-md overflow-hidden" 
        align="start"
        sideOffset={8}
      >
        <Command className="bg-white dark:bg-slate-900">
          <CommandInput 
            placeholder={`Tìm ${title?.toLowerCase()}...`} 
            className="h-9 px-3 text-sm border-b border-rose-100 dark:border-rose-800/30 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-sm text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Filter className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy kết quả</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </CommandEmpty>
            <CommandGroup className="py-1.5 px-1">
              {options.map((option) => {
                const isSelected = option.value.toString() === value;
                return (
                  <CommandItem
                    key={option.value.toString()}
                    onSelect={() => {
                      if (isSelected) {
                        onValueChange?.("all");
                      } else {
                        onValueChange?.(option.value.toString());
                      }
                      const filterValues = isSelected ? [] : [option.value];
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 aria-selected:bg-rose-50 dark:aria-selected:bg-rose-900/20 aria-selected:text-rose-700 dark:aria-selected:text-rose-400 rounded-sm"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm text-sm",
                        isSelected 
                          ? "bg-rose-600 dark:bg-rose-500 text-white border-rose-600 dark:border-rose-500" 
                          : "border border-slate-300 dark:border-slate-600"
                      )}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: isSelected ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </motion.div>
                    </div>
                    {option.icon && (
                      <option.icon className={cn(
                        "h-3.5 w-3.5", 
                        isSelected ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <Badge className="ml-auto h-5 px-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 text-xs rounded-full">
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {value !== "all" && (
              <>
                <CommandSeparator className="bg-rose-100 dark:bg-rose-800/30 -mx-1" />
                <CommandGroup className="py-1.5 px-1">
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                      onValueChange?.("all");
                    }}
                    className="justify-center text-center w-full px-2 py-1.5 cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-sm font-medium text-sm"
                  >
                    Xóa bộ lọc
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}