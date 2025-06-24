import { CategoryResponse } from "@/data/interfaces";
import { SRO } from "@/data/sro";
import { apiGet } from "@/services/api";

export const CategoryAPI = {
  async CategoryList() {
    const res = await apiGet<SRO<CategoryResponse[]>>("/v1/admin/categories");
    return res.data.data;
  }
};