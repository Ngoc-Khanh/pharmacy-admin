import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { routes } from "@/config";
import { InvoiceUpdateStatusDto } from "@/data/dto";
import { InvoiceStatus } from "@/data/enum";
import { InvoiceResponse } from "@/data/interfaces";
import { UseMutationResult } from "@tanstack/react-query";
import { ArrowLeft, Download, Edit, Save, X } from "lucide-react";
import { AnimatePresence, motion } from 'motion/react';
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface InvoiceDetailActionProps {
  editingStatus: boolean;
  startEditingStatus: () => void;
  cancelEditing: () => void;
  handleStatusUpdate: () => void;
  newStatus: InvoiceStatus;
  updateStatusMutation: UseMutationResult<InvoiceResponse, Error, InvoiceUpdateStatusDto>;
}

export function InvoiceDetailAction({
  editingStatus,
  startEditingStatus,
  cancelEditing,
  handleStatusUpdate,
  newStatus,
  updateStatusMutation,
}: InvoiceDetailActionProps) {
  const navigate = useNavigate();

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.admin.invoices)}
        className="gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <AnimatePresence mode="wait">
          {!editingStatus ? (
            <motion.div
              key="edit-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditingStatus}
                    className="gap-2 border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/40 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20"
                  >
                    <Edit className="h-4 w-4" />
                    Cập nhật trạng thái
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Thay đổi trạng thái hóa đơn</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ) : (
            <motion.div
              key="save-buttons"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={cancelEditing}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending || !newStatus}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="h-4 w-4" />
                {updateStatusMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={printInvoice}
              className="gap-2 border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/40 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              <Download className="h-4 w-4" />
              In hóa đơn
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>In hoặc tải xuống hóa đơn</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  )
}