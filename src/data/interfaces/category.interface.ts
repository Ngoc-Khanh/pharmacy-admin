import { MedicineResponse } from "@/data/interfaces";

export interface CategoryResponse {
  readonly id: string;
  title: string;
  slug: string;
  description: string;
  isActive?: boolean;
  readonly updatedAt: string;
  readonly createdAt: string;
}

export interface CategoryDetailResponse extends CategoryResponse {
  medicines: MedicineResponse[];
}

export interface CategoryStatsResponse {
  totalCategories: number;
  totalActiveCategories: number;
  totalInactiveCategories: number;
  categoriesWithProducts: number;
  categoriesWithoutProducts: number;
}