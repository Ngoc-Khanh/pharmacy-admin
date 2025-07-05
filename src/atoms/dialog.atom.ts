import { CategoryResponse, InvoiceResponse, MedicineResponse, OrderResponse, SupplierResponse, UserResponse } from "@/data/interfaces";
import { atom, useAtom } from "jotai";

export type DialogType = "add" | "edit" | "delete" | "bulk-delete";

// Account Dialog
export type AccountDialogType = DialogType | "detail" | "suspend" | "activate";

export const openAccountDialogAtom = atom<AccountDialogType | null>(null);
export const currentAccountAtom = atom<UserResponse | null>(null);
export const selectedAccountsForBulkDeleteAtom = atom<UserResponse[]>([]);

export const useAccountDialog = () => {
  const [open, setOpen] = useAtom(openAccountDialogAtom);
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom);
  const [selectedAccountsForBulkDelete, setSelectedAccountsForBulkDelete] = useAtom(selectedAccountsForBulkDeleteAtom);
  return { open, setOpen, currentAccount, setCurrentAccount, selectedAccountsForBulkDelete, setSelectedAccountsForBulkDelete };
}

// Category Dialog
export type CategoryDialogType = DialogType | "status" | "detail";

export const openCategoryDialogAtom = atom<CategoryDialogType | null>(null);
export const currentCategoryAtom = atom<CategoryResponse | null>(null);

export const useCategoryDialog = () => {
  const [open, setOpen] = useAtom(openCategoryDialogAtom);
  const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
  return { open, setOpen, currentCategory, setCurrentCategory };
}

// Medicine Dialog
export type MedicineDialogType = DialogType | "detail" | "thumbnail" | "bulk-delete";

export const openMedicineDialogAtom = atom<MedicineDialogType | null>(null);
export const currentMedicineAtom = atom<MedicineResponse | null>(null);
export const selectedMedicinesForBulkDeleteAtom = atom<MedicineResponse[]>([]);

export const useMedicineDialog = () => {
  const [open, setOpen] = useAtom(openMedicineDialogAtom);
  const [currentMedicine, setCurrentMedicine] = useAtom(currentMedicineAtom);
  const [selectedMedicinesForBulkDelete, setSelectedMedicinesForBulkDelete] = useAtom(selectedMedicinesForBulkDeleteAtom);
  return { open, setOpen, currentMedicine, setCurrentMedicine, selectedMedicinesForBulkDelete, setSelectedMedicinesForBulkDelete };
}

// Supplier Dialog
export type SupplierDialogType = DialogType | "detail";

export const openSupplierDialogAtom = atom<SupplierDialogType | null>(null);
export const currentSupplierAtom = atom<SupplierResponse | null>(null);

export const useSupplierDialog = () => {
  const [open, setOpen] = useAtom(openSupplierDialogAtom);
  const [currentSupplier, setCurrentSupplier] = useAtom(currentSupplierAtom);
  return { open, setOpen, currentSupplier, setCurrentSupplier };
}


// Order Dialog
export type OrderDialogType = DialogType | "detail" | "confirm" | "complete" | "cancel";

export const openOrderDialogAtom = atom<OrderDialogType | null>(null);
export const currentOrderAtom = atom<OrderResponse | null>(null);

export const useOrderDialog = () => {
  const [open, setOpen] = useAtom(openOrderDialogAtom);
  const [currentOrder, setCurrentOrder] = useAtom(currentOrderAtom);
  return { open, setOpen, currentOrder, setCurrentOrder };
}

// Invoice Dialog
export type InvoiceDialogType = DialogType | "change-status" | "detail";

export const openInvoiceDialogAtom = atom<InvoiceDialogType | null>(null);
export const currentInvoiceAtom = atom<InvoiceResponse | null>(null);

export const useInvoiceDialog = () => {
  const [open, setOpen] = useAtom(openInvoiceDialogAtom);
  const [currentInvoice, setCurrentInvoice] = useAtom(currentInvoiceAtom);
  return { open, setOpen, currentInvoice, setCurrentInvoice };
}
