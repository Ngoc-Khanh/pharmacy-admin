import { AddCategoryDto, UpdateCategoryDto } from "@/data/dto";
import { CategoryResponse } from "@/data/interfaces";
import { SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const CategoryAPI = {
  async CategoryList() {
    const res = await apiGet<SRO<CategoryResponse[]>>("v1/admin/categories");
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