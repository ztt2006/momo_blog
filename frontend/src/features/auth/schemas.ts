import { z } from "zod"

import type { LoginPayload, RegisterPayload } from "@/features/auth/types"

export const loginSchema = z.object({
  username: z.string().trim().min(1, "请输入用户名"),
  password: z.string().trim().min(1, "请输入密码"),
})

export const registerSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 个字符").max(50, "用户名不能超过 50 个字符"),
  email: z.string().trim().email("请输入有效邮箱地址"),
  password: z.string().trim().min(6, "密码至少 6 位").max(128, "密码不能超过 128 位"),
  nickname: z.string().trim().max(100, "昵称不能超过 100 个字符").optional().or(z.literal("")),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export function createLoginPayload(values: LoginFormValues): LoginPayload {
  return {
    username: values.username.trim(),
    password: values.password.trim(),
  }
}

export function createRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password.trim(),
    nickname: values.nickname?.trim() || null,
  }
}
