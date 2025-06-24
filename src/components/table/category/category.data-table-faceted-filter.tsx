import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { CheckIcon, Filter, PlusCircle } from "lucide-react";

interface CategoryDataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string | boolean;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }[];
  className?: string;
}

export function CategoryDataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: CategoryDataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as (string | boolean)[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-9 border-amber-200 dark:border-amber-800/40 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 px-3 shadow-sm",
            selectedValues?.size > 0 ? "border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400" : "border-dashed"
          )}
        >
          {selectedValues?.size > 0 ? (
            <Filter className="h-3.5 w-3.5 mr-2 text-amber-500 dark:text-amber-400" />
          ) : (
            <PlusCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 bg-amber-200 dark:bg-amber-800/60" />
              <Badge
                variant="secondary"
                className="rounded-md px-1.5 py-0 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                  >
                    {selectedValues.size} đã chọn
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value.toString()}
                        className={cn(
                          "rounded-md px-1.5 py-0 text-xs font-medium",
                          option.color || "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                        )}
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[220px] p-0 border-amber-100 dark:border-amber-800/40 shadow-lg rounded-md overflow-hidden" 
        align="start"
        sideOffset={8}
      >
        <Command className="bg-white dark:bg-slate-900">
          <CommandInput 
            placeholder={`Tìm ${title?.toLowerCase()}...`} 
            className="h-9 px-3 text-sm border-b border-amber-100 dark:border-amber-800/30 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <CommandList>
            <CommandEmpty className="py-3 text-sm text-center text-muted-foreground">
              Không tìm thấy kết quả.
            </CommandEmpty>
            <CommandGroup className="py-1.5 px-1">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value.toString()}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues);
                      if (isSelected) {
                        newSelectedValues.delete(option.value);
                      } else {
                        newSelectedValues.add(option.value);
                      }
                      const filterValues = Array.from(newSelectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 aria-selected:bg-amber-50 dark:aria-selected:bg-amber-900/20 aria-selected:text-amber-700 dark:aria-selected:text-amber-400 rounded-sm"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm text-sm",
                        isSelected 
                          ? "bg-amber-600 dark:bg-amber-500 text-white border-amber-600 dark:border-amber-500" 
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
                        isSelected ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate">{option.label}</span>
                    {facets?.get(option.value) && (
                      <Badge className="ml-auto h-5 px-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 text-xs rounded-full">
                        {facets.get(option.value)}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator className="bg-amber-100 dark:bg-amber-800/30 -mx-1" />
                <CommandGroup className="py-1.5 px-1">
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
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