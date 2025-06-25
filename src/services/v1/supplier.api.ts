import { AddSupplierDto, UpdateSupplierDto } from "@/data/dto";
import { SupplierResponse } from "@/data/interfaces";
import { SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const SupplierAPI = {
  async SupplierList() {
    const res = await apiGet<SRO<SupplierResponse[]>>("v1/admin/suppliers");
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