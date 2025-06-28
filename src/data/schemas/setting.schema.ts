import { z } from "zod";

export const profileSettingSchema = z.object({
  firstname: z.string().min(1, { message: "Tên là bắt buộc" }),
  lastname: z.string().min(1, { message: "Họ là bắt buộc" }),
  phone: z.string().min(1, { message: "Số điện thoại là bắt buộc" }),
});

export type ProfileSettingSchema = z.infer<typeof profileSettingSchema>;

export const accountSettingSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập là bắt buộc" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export type AccountSettingSchema = z.infer<typeof accountSettingSchema>;