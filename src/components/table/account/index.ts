import { AccountRole, AccountStatus } from "@/data/enum";
import { UserResponse } from "@/data/interfaces";
import { ShieldCheck, Stethoscope, UserCircle2 } from "lucide-react";

// Loại trạng thái với màu sắc tinh chỉnh
export const statusTypes = new Map<UserResponse["status"], string>([
  [AccountStatus.ACTIVE, "bg-emerald-50/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 ring-1 ring-emerald-200/80 shadow-sm dark:bg-emerald-900/20 dark:border-emerald-700 dark:ring-emerald-800/30"],
  [AccountStatus.SUSPENDED, "bg-amber-50/80 text-amber-600 dark:text-amber-400 border-amber-200 ring-1 ring-amber-200/80 shadow-sm dark:bg-amber-900/20 dark:border-amber-700 dark:ring-amber-800/30"],
  [AccountStatus.PENDING, "bg-sky-50/80 text-sky-600 dark:text-sky-400 border-sky-200 ring-1 ring-sky-200/80 shadow-sm dark:bg-sky-900/20 dark:border-sky-700 dark:ring-sky-800/30"],
]);

// Vai trò người dùng với kiểu dáng tinh chỉnh
export const userTypes = [
  {
    label: "Quản trị viên",
    value: AccountRole.ADMIN,
    icon: ShieldCheck,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30",
  },
  {
    label: "Dược sĩ",
    value: AccountRole.PHARMACIST,
    icon: Stethoscope,
    color: "text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30",
  },
  {
    label: "Khách hàng",
    value: AccountRole.CUSTOMER,
    icon: UserCircle2,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30",
  },
];

export * from "./account.columns";
export { default as AccountDataTable } from "./account.data-table";

