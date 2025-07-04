export interface ListParams {
  s?: string;
  page?: number;
  limit?: number;
}

export interface AccountListParams extends ListParams {
  role?: string;
  status?: string;
}