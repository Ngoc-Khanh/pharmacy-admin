import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PaymentMethod } from "@/data/enum";
import { InvoiceDetailResponse, InvoiceDetailsItem } from "@/data/interfaces";
import { getPaymentMethodDisplay } from "@/lib/invoice-helper";
import { formatCurrency } from "@/lib/utils";
import { Building2, Copy, Mail, MapPin, Package, Phone, User } from "lucide-react";
import { motion } from 'motion/react';
import { useCallback } from "react";
import { toast } from "sonner";

interface InvoiceDetailInformationProps {
  invoice: InvoiceDetailResponse;
}

export function InvoiceDetailInformation({ invoice }: InvoiceDetailInformationProps) {
  const copyInvoiceId = useCallback(() => {
    if (invoice?.id) {
      navigator.clipboard.writeText(invoice.id);
      toast.success("Đã sao chép ID hóa đơn");
    }
  }, [invoice?.id]);

  const subtotal = invoice?.totalPrice || 0;
  const vatAmount = subtotal * 0.1;
  const totalWithVat = subtotal + vatAmount;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Company Information */}
        <div>
          <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 md:mb-4">
            <Building2 className="h-4 md:h-5 w-4 md:w-5 text-emerald-600" />
            Thông tin công ty
          </h3>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 md:p-4 rounded-lg space-y-1 md:space-y-2 text-sm md:text-base">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Nhà thuốc Pharmacity</p>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400">Trụ sở: 248A Nơ Trang Long, P.12, Q.Bình Thạnh, TP.Hồ Chí Minh</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <p className="text-slate-600 dark:text-slate-400">1800 6821</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <p className="text-slate-600 dark:text-slate-400">cskh@pharmacity.vn</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 md:mb-4">
            <User className="h-4 md:h-5 w-4 md:w-5 text-emerald-600" />
            Thông tin khách hàng
          </h3>
          {invoice ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 md:p-4 rounded-lg space-y-1 md:space-y-2 text-sm md:text-base">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{invoice.order?.shippingAddress?.name}</p>
              {invoice.order?.shippingAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-600 dark:text-slate-400">
                    {invoice.order.shippingAddress.addressLine1}
                    {invoice.order.shippingAddress.addressLine2 && `, ${invoice.order.shippingAddress.addressLine2}`}
                    {invoice.order.shippingAddress.city && `, ${invoice.order.shippingAddress.city}`}
                    {invoice.order.shippingAddress.state && `, ${invoice.order.shippingAddress.state}`}
                    {invoice.order.shippingAddress.country && `, ${invoice.order.shippingAddress.country}`}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <p className="text-slate-600 dark:text-slate-400">{invoice.order?.shippingAddress?.phone || "Chưa cập nhật"}</p>
              </div>
              {invoice.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <p className="text-slate-600 dark:text-slate-400">{invoice.user?.email}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 md:p-4 rounded-lg">
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Không có thông tin khách hàng</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-4 md:mb-6">
        <div className="grid grid-cols-3 gap-3 md:gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 md:p-4 rounded-lg text-sm md:text-base">
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Mã đơn hàng:</p>
            <p className="font-semibold">{invoice?.orderId || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Phương thức thanh toán:</p>
            <p className="font-semibold">{getPaymentMethodDisplay(invoice?.paymentMethod || PaymentMethod.CREDIT_CARD)}</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">ID hóa đơn:</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold font-mono text-xs md:text-sm">{invoice?.id}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 print:hidden"
                    onClick={copyInvoiceId}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sao chép ID hóa đơn</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 md:mb-4">Chi tiết hóa đơn</h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Mô tả sản phẩm/dịch vụ
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="px-3 md:px-4 py-2 md:py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {invoice?.items.map((item: InvoiceDetailsItem, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-3 md:px-4 py-3 md:py-4 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.medicine?.name || `Sản phẩm #${item.medicineId}`}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-center font-medium">
                    {item.quantity}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-right font-medium">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-right font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Note */}
      <div className="mb-4 md:mb-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 md:p-4">
          <p className="text-xs md:text-sm text-amber-800 dark:text-amber-200">
            <strong>Ghi chú:</strong> Thanh toán trong vòng 30 ngày kể từ ngày xuất hóa đơn.
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 md:pt-6">
        <div className="flex justify-end">
          <div className="w-full max-w-sm md:max-w-md space-y-2 text-sm md:text-base">
            <div className="flex justify-between py-1 md:py-2">
              <span className="text-slate-600 dark:text-slate-400">Tạm tính:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 md:py-2">
              <span className="text-slate-600 dark:text-slate-400">VAT (10%):</span>
              <span className="font-medium">{formatCurrency(vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2 md:py-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 md:px-4 rounded-lg">
              <span className="text-base md:text-lg font-bold text-emerald-900 dark:text-emerald-100">Tổng cộng:</span>
              <span className="text-lg md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalWithVat)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2">
          Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Mọi thắc mắc xin liên hệ: info@abctech.com | (028) 1234 5678
        </p>
      </div>
    </div>
  )
}