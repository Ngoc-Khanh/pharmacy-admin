import { AddSupplierDto, UpdateSupplierDto } from "@/data/dto";
import { ListParams, SupplierResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const SupplierAPI = {
  async SupplierList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/suppliers?${queryString}` : "v1/admin/suppliers";
    const res = await apiGet<SRO<Paginated<SupplierResponse>>>(url);
    return res.data.data;
  },

  async SupplierAdd(data: AddSupplierDto) {
    const res = await apiPost<AddSupplierDto, SRO<SupplierResponse>>("v1/admin/suppliers/add", data);
    return res.data.data;
  },

  async SupplierUpdate(id: string, data: UpdateSupplierDto) {
    const res = await apiPatch<UpdateSupplierDto, SRO<SupplierResponse>>(`v1/admin/suppliers/update/${id}`, data);
    return res.data.data;
  },

  async DeleteSupplier(id: string) {
    const res = await apiDelete<SRO<SupplierResponse>>(`v1/admin/suppliers/delete/${id}`);
    return res.data.data;
  }
}