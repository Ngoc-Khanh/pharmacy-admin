import { CategoryResponse, UserResponse } from "@/data/interfaces";
import { atom, useAtom } from "jotai";

export type DialogType = "add" | "edit" | "delete" | "bulk-delete";

export type AccountDialogType = DialogType | "detail" | "suspend" | "activate";

export const openAccountDialogAtom = atom<AccountDialogType | null>(null);
export const currentAccountAtom = atom<UserResponse | null>(null);
export const selectedAccountsForBulkDeleteAtom = atom<UserResponse[]>([]);

export const useAccountDialog = () => {
  const [open, setOpen] = useAtom(openAccountDialogAtom);
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom);
  const [selectedAccountsForBulkDelete, setSelectedAccountsForBulkDelete] = useAtom(selectedAccountsForBulkDeleteAtom);
  return { 
    open, 
    setOpen, 
    currentAccount, 
    setCurrentAccount,
    selectedAccountsForBulkDelete,
    setSelectedAccountsForBulkDelete
  };
}

export type CategoryDialogType = DialogType | "status";

export const openCategoryDialogAtom = atom<CategoryDialogType | null>(null);
export const currentCategoryAtom = atom<CategoryResponse | null>(null);

export const useCategoryDialog = () => {
  const [open, setOpen] = useAtom(openCategoryDialogAtom);
  const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
  return { open, setOpen, currentCategory, setCurrentCategory };
}