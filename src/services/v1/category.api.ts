import { AddCategoryDto, UpdateCategoryDto } from "@/data/dto";
import { CategoryResponse, ListParams } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const CategoryAPI = {
  async CategoryList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/categories?${queryString}` : "v1/admin/categories";
    const res = await apiGet<SRO<Paginated<CategoryResponse>>>(url);
    return res.data.data;
  },

  async CategoryCreate(data: AddCategoryDto) {
    const res = await apiPost<AddCategoryDto, SRO<CategoryResponse>>("v1/admin/categories/create", data);
    return res.data.data;
  },

  async CategoryUpdate(id: string, data: UpdateCategoryDto) {
    const res = await apiPatch<UpdateCategoryDto, SRO<CategoryResponse>>(`v1/admin/categories/update/${id}`, data);
    return res.data.data;
  },

  async CategoryDelete(id: string) {
    const res = await apiDelete<SRO<CategoryResponse>>(`v1/admin/categories/delete/${id}`);
    return res.data.data;
  }
};