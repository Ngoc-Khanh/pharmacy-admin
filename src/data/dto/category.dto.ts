export type AddCategoryDto = {
  title: string;
  description: string;
  isActive: boolean;
}

export type UpdateCategoryDto = {
  title?: string;
  description?: string;
  isActive?: boolean;
}