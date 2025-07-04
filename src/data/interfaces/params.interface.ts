export interface ListParams {
  s?: string;
  page?: number;
  limit?: number;
}

export interface AccountListParams extends ListParams {
  role?: string;
  status?: string;
}

export interface OrderListParams extends ListParams {
  status?: string;
}

export interface InvoiceListParams extends ListParams {
  status?: string;
}