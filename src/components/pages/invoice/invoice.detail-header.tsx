import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceStatus } from "@/data/enum";
import { InvoiceResponse } from "@/data/interfaces";
import { getStatusBadge } from "@/lib/invoice-helper";
import { formatDate } from "@/lib/utils";
import { Ban, CheckCircle2, Clock, Receipt, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface InvoiceDetailHeaderProps {
  invoice: InvoiceResponse;
  editingStatus: boolean;
  newStatus: InvoiceStatus;
  setNewStatus: (status: InvoiceStatus) => void;
}

export function InvoiceDetailHeader({ invoice, editingStatus, newStatus, setNewStatus }: InvoiceDetailHeaderProps) {
  return (
    <div className="bg-emerald-600 text-white p-4 print:bg-emerald-600 print:text-white">
      <div className="flex items-center justify-between gap-4">
        {/* Company Info */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Receipt size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HÓA ĐƠN</h1>
            <p className="text-sm opacity-90">#{invoice?.invoiceNumber}</p>
          </div>
        </div>

        {/* Status & Date */}
        <div className="text-right min-w-[200px]">
          <div className="mb-3">
            <AnimatePresence mode="wait">
              {editingStatus ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="print:hidden flex justify-end"
                >
                  <Select value={newStatus || undefined} onValueChange={(value) => setNewStatus(value as InvoiceStatus)}>
                    <SelectTrigger className="w-[180px] bg-white text-slate-900">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={InvoiceStatus.PENDING}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Chờ thanh toán</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={InvoiceStatus.PAID}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>Đã thanh toán</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={InvoiceStatus.CANCELLED}>
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4 text-rose-500" />
                          <span>Đã hủy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={InvoiceStatus.REFUNDED}>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                          <span>Đã hoàn tiền</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              ) : (
                <motion.div
                  key="badge"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-end"
                >
                  {getStatusBadge(invoice?.status || InvoiceStatus.PENDING)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex gap-4 text-emerald-100">
            <div className="text-right">
              <p className="text-xs opacity-80">Ngày lập:</p>
              <p className="text-sm font-semibold">{formatDate(invoice?.issuedAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Hạn thanh toán:</p>
              <p className="text-sm font-semibold">{formatDate(invoice?.issuedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}