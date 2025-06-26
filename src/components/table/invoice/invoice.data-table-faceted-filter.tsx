import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { CheckIcon, Filter, PlusCircle } from "lucide-react";
import { motion } from "motion/react";

interface InvoiceDataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string | boolean;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    count?: number; // Tổng số từ toàn bộ data
  }[];
}

export function InvoiceDataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: InvoiceDataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as (string | boolean)[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 px-3 shadow-sm",
            selectedValues?.size > 0 ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400" : "border-dashed"
          )}
        >
          {selectedValues?.size > 0 ? (
            <Filter className="h-3.5 w-3.5 mr-2 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <PlusCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 bg-emerald-200 dark:bg-emerald-800/60" />
              <Badge
                variant="secondary"
                className="rounded-md px-1.5 py-0 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                  >
                    {selectedValues.size} đã chọn
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="outline"
                        key={option.value.toString()}
                        className={cn(
                          "rounded-md px-1.5 py-0 text-xs font-medium flex items-center gap-1",
                          option.color || "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                        )}
                      >
                        {option.icon && <option.icon className="h-3 w-3" />}
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
        className="w-[220px] p-0 border-emerald-100 dark:border-emerald-800/40 shadow-lg rounded-md overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <Command className="bg-white dark:bg-slate-900">
          <CommandInput
            placeholder={`Tìm ${title?.toLowerCase()}...`}
            className="h-9 px-3 text-sm border-b border-emerald-100 dark:border-emerald-800/30 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value.toString()}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 aria-selected:bg-emerald-50 dark:aria-selected:bg-emerald-900/20 aria-selected:text-emerald-700 dark:aria-selected:text-emerald-400 rounded-sm"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm text-sm",
                        isSelected
                          ? "bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-500"
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
                        isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <Badge className="ml-auto h-5 px-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 text-xs rounded-full">
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator className="bg-emerald-100 dark:bg-emerald-800/30 -mx-1" />
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