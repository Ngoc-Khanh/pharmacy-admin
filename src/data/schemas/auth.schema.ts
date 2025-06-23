import { z } from "zod";

export const credentialSchema = z.object({
  account: z
    .string()
    .min(1, { message: "Vui lòng nhập email hoặc tên đăng nhập!" })
    .min(3, { message: "Email hoặc tên đăng nhập phải có ít nhất 3 ký tự!" })
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length >= 3,
      {
        message: "Email hoặc tên đăng nhập không hợp lệ!",
      }
    ),
  password: z
    .string()
    .min(1, { message: "Vui lòng nhập mật khẩu!" })
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự!" }),
});

export type CredentialForm = z.infer<typeof credentialSchema>;