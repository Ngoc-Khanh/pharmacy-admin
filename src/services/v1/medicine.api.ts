import { ListParams, MedicineResponse, MedicineStatsResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiGet } from "@/services/api";

export const MedicineAPI = {
  async MedicineList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/medicines?${queryString}&sort_order=asc` : "v1/admin/medicines?sort_order=asc";
    const res = await apiGet<SRO<Paginated<MedicineResponse>>>(url);
    return res.data.data;
  },
  
  async MedicineStats() {
    const res = await apiGet<SRO<MedicineStatsResponse>>("v1/admin/medicines/statistics");
    return res.data.data;
  }
}