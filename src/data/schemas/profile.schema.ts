import { z } from "zod";

export const profileSchema = z.object({
  firstname: z.string().min(1, { message: "Tên là bắt buộc" }),
  lastname: z.string().min(1, { message: "Họ là bắt buộc" }),
  phone: z.string().min(1, { message: "Số điện thoại là bắt buộc" }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;