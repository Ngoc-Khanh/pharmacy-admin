import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckIcon, Filter, PlusCircle } from "lucide-react";

interface AccountDataTableFacetedFilterProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    count?: number;
  }[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export function AccountDataTableFacetedFilter({
  title,
  options,
  value,
  onValueChange
}: AccountDataTableFacetedFilterProps) {
  const hasValue = value && value !== "all";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-10 border-cyan-200 dark:border-cyan-800/40 bg-white dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200 px-3 shadow-sm",
            hasValue ? "border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-400" : "border-dashed"
          )}
        >
          {hasValue ? (
            <Filter className="h-3.5 w-3.5 mr-2 text-cyan-500 dark:text-cyan-400" />
          ) : (
            <PlusCircle className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{title}</span>
          {hasValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 bg-cyan-200 dark:bg-cyan-800/60" />
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => option.value === value)
                  .map((option) => (
                    <Badge
                      variant="outline"
                      key={option.value}
                      className={cn(
                        "rounded-md px-1.5 py-0 text-xs font-medium flex items-center gap-1",
                        option.color || "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50"
                      )}
                    >
                      {option.icon && <option.icon className="h-3 w-3" />}
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[220px] p-0 border-cyan-100 dark:border-cyan-800/40 shadow-lg rounded-md overflow-hidden" 
        align="start"
        sideOffset={8}
      >
        <Command className="bg-white dark:bg-slate-900">
          <CommandInput 
            placeholder={`Tìm ${title?.toLowerCase()}...`} 
            className="h-9 px-3 text-sm border-b border-cyan-100 dark:border-cyan-800/30 focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <CommandItem
                value="all"
                onSelect={() => onValueChange?.("all")}
                className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer text-sm hover:bg-cyan-50 dark:hover:bg-cyan-900/20 aria-selected:bg-cyan-50 dark:aria-selected:bg-cyan-900/20 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-400 rounded-sm"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm text-sm",
                    value === "all"
                      ? "bg-cyan-600 dark:bg-cyan-500 text-white border-cyan-600 dark:border-cyan-500" 
                      : "border border-slate-300 dark:border-slate-600"
                  )}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: value === "all" ? 1 : 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </motion.div>
                </div>
                <span className="truncate">Tất cả {title?.toLowerCase()}</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onValueChange?.(option.value)}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer text-sm hover:bg-cyan-50 dark:hover:bg-cyan-900/20 aria-selected:bg-cyan-50 dark:aria-selected:bg-cyan-900/20 aria-selected:text-cyan-700 dark:aria-selected:text-cyan-400 rounded-sm"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm text-sm",
                        isSelected 
                          ? "bg-cyan-600 dark:bg-cyan-500 text-white border-cyan-600 dark:border-cyan-500" 
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
                        isSelected ? "text-cyan-600 dark:text-cyan-400" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <Badge className="ml-auto h-5 px-1.5 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50 text-xs rounded-full">
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}