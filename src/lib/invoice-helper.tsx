import { Badge } from "@/components/ui/badge";
import { InvoiceStatus, PaymentMethod } from "@/data/enum";
import { Ban, CheckCircle2, Clock, RefreshCw } from "lucide-react";

export const getStatusBadge = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.PAID:
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors gap-1.5 px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Đã thanh toán
        </Badge>
      );
    case InvoiceStatus.PENDING:
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:border-amber-600 hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors gap-1.5 px-3 py-1">
          <Clock className="h-3.5 w-3.5" />
          Chờ thanh toán
        </Badge>
      );
    case InvoiceStatus.CANCELLED:
      return (
        <Badge className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-800 dark:text-rose-100 dark:border-rose-600 hover:bg-rose-200 dark:hover:bg-rose-700 transition-colors gap-1.5 px-3 py-1">
          <Ban className="h-3.5 w-3.5" />
          Đã hủy
        </Badge>
      );
    case InvoiceStatus.REFUNDED:
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors gap-1.5 px-3 py-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Đã hoàn tiền
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-3 py-1">
          {status}
        </Badge>
      );
  }
};

export const getPaymentMethodDisplay = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return "Thẻ tín dụng";
    case PaymentMethod.BANK_TRANSFER:
      return "Chuyển khoản";
    case PaymentMethod.COD:
      return "Thanh toán khi nhận hàng";
    default:
      return "Khác";
  }
};

