import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { UserResponse } from "@/data/interfaces";
import { AccountAPI } from "@/services/v1";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { motion } from 'motion/react';
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAccounts: UserResponse[];
  onSuccess?: () => void;
}

export function AccountBulkDeleteDialog({
  open,
  onOpenChange,
  selectedAccounts,
  onSuccess
}: Props) {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: async (accountIds: string[]) => {
      return await AccountAPI.AccountBulkDelete(accountIds);
    },
    onSuccess: (result) => {
      const deletedCount = result.deletedCount;
      const totalCount = selectedAccounts.length;
      
      if (deletedCount === totalCount) {
        toast.success(`Đã xóa thành công ${deletedCount} tài khoản`);
      } else if (deletedCount > 0) {
        toast.warning(`Đã xóa ${deletedCount} tài khoản, ${totalCount - deletedCount} tài khoản thất bại`);
      } else {
        toast.error("Không thể xóa tài khoản nào");
      }
      
      // Refresh tất cả queries liên quan đến accounts
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-search"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-stats"] });
      
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Bulk delete error:", error);
      toast.error("Có lỗi xảy ra khi xóa tài khoản");
    },
  });

  const handleConfirm = () => {
    const accountIds = selectedAccounts.map(account => account.id);
    deleteMutation.mutate(accountIds);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      title="Xóa nhiều tài khoản"
      desc={
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800/30">
            <div className="bg-rose-100 dark:bg-rose-800/30 p-2 rounded-lg">
              <Users className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="font-medium text-rose-800 dark:text-rose-300">
                Bạn có chắc muốn xóa {selectedAccounts.length} tài khoản đã chọn?
              </p>
              <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Danh sách tài khoản sẽ bị xóa:
            </p>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              {selectedAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {account.firstname} {account.lastname}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({account.email})
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      }
      confirmText={
        deleteMutation.isPending ? (
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Đang xóa...
          </span>
        ) : "Xóa Vĩnh Viễn"
      }
      cancelBtnText="Hủy bỏ"
      destructive={true}
      isLoading={deleteMutation.isPending}
    />
  );
} 