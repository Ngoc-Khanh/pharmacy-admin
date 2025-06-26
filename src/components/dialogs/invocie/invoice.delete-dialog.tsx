import { useInvoiceDialog } from "@/atoms";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceResponse } from "@/data/interfaces";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceAPI } from "@/services/v1";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  currentInvoice: InvoiceResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDeleteDialog({ currentInvoice, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { setCurrentInvoice } = useInvoiceDialog();
  const [nameConfirmation, setNameConfirmation] = useState("");
  const [showError, setShowError] = useState(false);

  const isConfirmed = nameConfirmation === currentInvoice.id;

  const { mutate: deleteInvoice, isPending } = useMutation({
    mutationFn: () => InvoiceAPI.InvoiceDelete(currentInvoice.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Đã xóa hóa đơn thành công", {
        className: "bg-white dark:bg-slate-800 dark:text-white border-emerald-100 dark:border-slate-700",
      });
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          setCurrentInvoice(null);
          setNameConfirmation("");
          setShowError(false);
        }, 300);
      }, 1000);
    },
    onError: (error) => {
      toast.error("Không thể xóa hóa đơn, vui lòng thử lại", {
        className: "bg-white dark:bg-slate-800 dark:text-white border-rose-100 dark:border-slate-700",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
      });
    },
  });

  const handleConfirmDelete = () => {
    if (isConfirmed) deleteInvoice();
    else setShowError(true);
  };

  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
    setNameConfirmation("");
    setShowError(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      if (isPending) return;
      onOpenChange(newOpen);
      if (!newOpen) {
        setNameConfirmation("");
        setShowError(false);
      }
    }}>
      <AlertDialogContent className="sm:max-w-md overflow-hidden p-0 gap-0 border border-slate-200 dark:border-slate-700 shadow-lg">
        {/* Header */}
        <div className="bg-rose-50 dark:bg-rose-950/20 p-4 border-b border-rose-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30">
                <Trash2 className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              </div>
              <AlertDialogHeader className="p-0 space-y-1">
                <AlertDialogTitle className="text-rose-600 dark:text-rose-400 text-xl">
                  Xóa hóa đơn
                </AlertDialogTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                  Thao tác này sẽ xóa vĩnh viễn dữ liệu hóa đơn
                </p>
              </AlertDialogHeader>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-rose-100 dark:hover:bg-rose-900/30"
              onClick={handleClose}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Cảnh báo: Không thể hoàn tác
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Hóa đơn sẽ bị xóa vĩnh viễn khỏi hệ thống cùng với tất cả dữ liệu liên quan.
              </p>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="space-y-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Thông tin hóa đơn sẽ bị xóa:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Mã hóa đơn:</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">{currentInvoice.id}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Tổng tiền:</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(currentInvoice.totalPrice)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Ngày tạo:</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(currentInvoice.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Trạng thái:</span>
                <p className="font-medium text-slate-900 dark:text-slate-100">{currentInvoice.status}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Để xác nhận, vui lòng nhập mã hóa đơn: <span className="font-mono text-rose-600 dark:text-rose-400 ml-1">{currentInvoice.id}</span>
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder={`Nhập "${currentInvoice.id}" để xác nhận`}
              value={nameConfirmation}
              onChange={(e) => {
                setNameConfirmation(e.target.value);
                if (showError) setShowError(false);
              }}
              className={`${showError ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200" : ""
                } dark:bg-slate-800`}
              disabled={isPending}
            />
            {showError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Mã hóa đơn không chính xác
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={!isConfirmed || isPending}
              className="flex-1 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
            >
              {isPending ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Đang xóa...
                  </span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xác nhận xóa
                </>
              )}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}