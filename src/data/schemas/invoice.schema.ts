import { InvoiceStatus, PaymentMethod } from "@/data/enum";
import { z } from "zod";

export const invoiceSchema = z.object({
  userId: z.string().min(1, "Vui lòng chọn người dùng"),
  invoiceNumber: z.string().optional(),
  items: z.array(
    z.object({
      medicineId: z.string().min(1, "Vui lòng chọn thuốc"),
      quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
      price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    })
  ).min(1, "Phải có ít nhất 1 sản phẩm"),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: "Vui lòng chọn phương thức thanh toán" }),
  }),
  shippingAddressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng"),
  issuedAt: z.string().optional(),
  status: z.nativeEnum(InvoiceStatus, {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái hóa đơn" }),
  }),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>; 