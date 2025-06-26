import { InvoiceStatus, PaymentMethod } from "@/data/enum";
import { MedicineResponse, OrderResponse, ProfileImage } from "@/data/interfaces";

export interface InvoiceResponse {
  readonly id: string;
  readonly orderId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  issuedAt: string;
  status: InvoiceStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface InvoiceItem {
  medicineId: string;
  quantity: number;
  price: number;
  itemTotal: number;
}

export interface InvoiceDetailResponse {
  readonly id: string;
  readonly orderId: string;
  readonly userId: string;
  readonly invoiceNumber: string;
  items: InvoiceDetailsItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  issuedAt: string;
  status: InvoiceStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
    phone: string;
    profileImage: ProfileImage;
  };
  order?: {
    shippingFee: string;
    discount: string;
    shippingAddress: {
      readonly id: string;
      name: string;
      phone: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      isDefault: boolean;
    };
  };
}

export interface InvoiceDetailsItem {
  readonly medicineId: string;
  quantity: number;
  price: number;
  itemTotal: number;
  medicine: MedicineResponse;
}

export interface InvoiceCreateWithNoOrderResponse {
  order: OrderResponse;
  invoice: InvoiceResponse;
}

export interface InvoiceStatsResponse {
  totalInvoices: number;
  totalRevenue: number;
  totalAverageRevenue: number;
  totalPaidInvoices: number;
  totalPendingInvoices: number;
  totalCancelledInvoices: number;
  totalRefundedInvoices: number;
}