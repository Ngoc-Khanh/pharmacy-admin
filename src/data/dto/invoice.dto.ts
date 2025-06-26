import { InvoiceStatus, PaymentMethod } from "@/data/enum";

export type InvoiceCreateWithNoOrderDto = {
  userId: string;
  invoiceNumber: string;
  items: {
    medicineId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: PaymentMethod;
  shippingAddressId: string
  issuedAt?: string;
  status: InvoiceStatus;
}

export type InvoiceUpdateStatusDto = {
  status: InvoiceStatus;
}