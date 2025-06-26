import { InvoiceUpdateStatusDto } from "@/data/dto";
import { InvoiceDetailResponse, InvoiceResponse, ListParams } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch } from "@/services/api";

export const InvoiceAPI = {
  async InvoiceList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/invoices/list?${queryString}&sort_order=asc` : "v1/admin/invoices/list?sort_order=asc";
    const res = await apiGet<SRO<Paginated<InvoiceResponse>>>(url);
    return res.data.data;
  },

  async InvoiceDetail(id: string) {
    const res = await apiGet<SRO<InvoiceDetailResponse>>(`v1/admin/invoices/${id}/detail`);
    return res.data.data;
  },

  async InvoiceUpdateStatus(id: string, dto: InvoiceUpdateStatusDto) {
    const res = await apiPatch<InvoiceUpdateStatusDto, SRO<InvoiceResponse>>(`v1/admin/invoices/${id}/update-status`, dto)
    return res.data.data;
  },

  async InvoiceDelete(id: string) {
    const res = await apiDelete<SRO<InvoiceResponse>>(`v1/admin/invoices/${id}/delete`);
    return res.data.data;
  }
}