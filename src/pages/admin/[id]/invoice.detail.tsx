import { InvoiceDetailAction, InvoiceDetailHeader, InvoiceDetailInformation, InvoiceStatusChangeAlert } from "@/components/pages/invoice";
import { InvoiceDetailSkeleton } from "@/components/pages/invoice/invoice.detail-skeletob";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config";
import { InvoiceUpdateStatusDto } from "@/data/dto";
import { InvoiceStatus } from "@/data/enum";
import { InvoiceDetailResponse, InvoiceResponse } from "@/data/interfaces";
import { InvoiceAPI } from "@/services/v1";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<InvoiceStatus | null>(null);

  const { data: invoice, isLoading } = useQuery<InvoiceDetailResponse>({
    queryKey: ["invoice", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return InvoiceAPI.InvoiceDetail(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateStatusMutation = useMutation({
    mutationFn: (dto: InvoiceUpdateStatusDto) => {
      if (!id) throw new Error("Invoice ID is required");
      return InvoiceAPI.InvoiceUpdateStatus(id, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Cập nhật trạng thái hóa đơn thành công!");
      setEditingStatus(false);
    }, onError: (error: Error) => {
      toast.error("Lỗi khi cập nhật trạng thái: " + (error?.message || "Vui lòng thử lại"));
    }
  });

  // Handle status update
  const handleStatusUpdate = useCallback(() => {
    if (!newStatus) {
      toast.error("Vui lòng chọn trạng thái mới");
      return;
    }
    if (invoice && newStatus === invoice.status) {
      toast.info("Trạng thái không có thay đổi");
      setEditingStatus(false);
      return;
    }
    updateStatusMutation.mutate({ status: newStatus });
  }, [newStatus, updateStatusMutation, invoice]);

  // Start editing status
  const startEditingStatus = useCallback(() => {
    if (invoice) {
      setNewStatus(invoice.status);
      setEditingStatus(true);
    }
  }, [invoice]);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingStatus(false);
    setNewStatus(null);
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <TooltipProvider>
        <Helmet>
          <title>Chi tiết hóa đơn | {siteConfig.name}</title>
        </Helmet>
        <InvoiceDetailSkeleton />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Helmet>
        <title>{invoice?.invoiceNumber ? `Hóa đơn #${invoice.invoiceNumber}` : 'Chi tiết hóa đơn'} | {siteConfig.name}</title>
      </Helmet>
      <div className="flex-1 space-y-6 p-2 md:p-4">
        {/* Action Bar - Hidden when printing */}
        <InvoiceDetailAction
          editingStatus={editingStatus}
          startEditingStatus={startEditingStatus}
          cancelEditing={cancelEditing}
          handleStatusUpdate={handleStatusUpdate}
          newStatus={newStatus || InvoiceStatus.PENDING}
          updateStatusMutation={updateStatusMutation}
        />

        {/* Status Change Alert - Hidden when printing */}
        <AnimatePresence>
          {editingStatus && (
            <InvoiceStatusChangeAlert />
          )}
        </AnimatePresence>

        {/* Invoice Layout - Traditional Format */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none print:rounded-none"
        >
          {/* Invoice Header */}
          <InvoiceDetailHeader
            invoice={invoice as unknown as InvoiceResponse}
            editingStatus={editingStatus}
            newStatus={newStatus || InvoiceStatus.PENDING}
            setNewStatus={setNewStatus}
          />

          {/* Company and Customer Info */}
          <InvoiceDetailInformation invoice={invoice as unknown as InvoiceDetailResponse} />
        </motion.div>
      </div>
    </TooltipProvider>
  )
}