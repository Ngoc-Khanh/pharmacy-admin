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

export const appearanceSettingSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export type AppearanceSettingSchema = z.infer<typeof appearanceSettingSchema>;

export const passwordSettingSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mật khẩu hiện tại là bắt buộc" }),
  newPassword: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái thường" })
    .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái viết hoa" })
    .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" })
    .regex(/[!@#$%^&*()_+{}[\]\]:;<>,.?~/-]/, { message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" }),
  newPasswordConfirmation: z.string().min(1, { message: "Xác nhận mật khẩu mới là bắt buộc" }),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
  message: "Mật khẩu không khớp",
  path: ["newPasswordConfirmation"],
});

export type PasswordSettingSchema = z.infer<typeof passwordSettingSchema>;