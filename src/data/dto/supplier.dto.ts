export type AddSupplierDto = {
  name: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
}

export type UpdateSupplierDto = {
  name?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
}