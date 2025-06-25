import { routeNames } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Chưa xác định";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";
  return format(dateObj, "dd/MM/yyyy");
}

/**
 * Safely get route name with fallback
 */
export function getPageTitle(route: string, siteName: string, fallback: string = "Trang"): string {
  const routeName = routeNames[route];
  return `${routeName || fallback} | ${siteName}`;
}