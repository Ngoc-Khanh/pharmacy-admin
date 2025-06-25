import { AccountDialogType, useAccountDialog } from "@/atoms";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AccountStatus } from "@/data/enum";
import { UserResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { ArrowUpRightFromCircle, Ban, Edit2, MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react";

interface AccountRowActionsProps {
  row: Row<UserResponse>;
}

export function AccountRowActions({ row }: AccountRowActionsProps) {
  const { setOpen, setCurrentAccount } = useAccountDialog();
  const isActive = row.original.status === AccountStatus.ACTIVE;
  
  const handleAction = (action: AccountDialogType) => {
    setCurrentAccount(row.original);
    setOpen(action);
  };
  
  return (
    <div className="flex justify-end items-center gap-2 pr-2">
      {/* Detail Button */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
              onClick={() => handleAction("detail")}
            >
              <ArrowUpRightFromCircle className="h-4 w-4 text-cyan-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            Xem chi tiết
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Actions Menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleAction("edit")}
            className="cursor-pointer"
          >
            <Edit2 className="h-4 w-4 mr-2 text-cyan-600" />
            Chỉnh sửa
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => handleAction(isActive ? "suspend" : "activate")}
            className={cn(
              "cursor-pointer",
              isActive ? "text-amber-600" : "text-destructive"
            )}
          >
            {isActive ? (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Vô hiệu hóa
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Kích hoạt
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => handleAction("delete")}
            className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa người dùng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}