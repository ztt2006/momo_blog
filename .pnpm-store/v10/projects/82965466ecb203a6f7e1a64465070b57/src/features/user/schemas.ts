import { z } from "zod"

import type { ManagedUser, UserCreatePayload, UserUpdatePayload } from "@/features/user/types"

export const userFormSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 个字符").max(50, "用户名不能超过 50 个字符"),
  email: z.string().trim().email("请输入有效邮箱地址"),
  password: z.string().trim().min(6, "密码至少 6 位").max(128, "密码不能超过 128 位"),
  nickname: z.string().trim().max(100, "昵称不能超过 100 个字符").optional().or(z.literal("")),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean(),
})

export const userEditFormSchema = userFormSchema.extend({
  password: z.string().trim().max(128, "密码不能超过 128 位").optional().or(z.literal("")),
})

export type UserFormValues = z.infer<typeof userFormSchema>
export type UserEditFormValues = z.infer<typeof userEditFormSchema>

export function getUserCreateDefaults(): UserFormValues {
  return {
    username: "",
    email: "",
    password: "",
    nickname: "",
    role: "user",
    isActive: true,
  }
}

export function getUserEditDefaults(user?: ManagedUser): UserEditFormValues {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    password: "",
    nickname: user?.nickname ?? "",
    role: user?.role === "admin" ? "admin" : "user",
    isActive: user?.isActive ?? true,
  }
}

export function createUserSubmitPayload(values: UserFormValues): UserCreatePayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password.trim(),
    nickname: values.nickname?.trim() || null,
    role: values.role,
    isActive: values.isActive,
  }
}

export function createUserUpdatePayload(values: UserEditFormValues): UserUpdatePayload {
  return {
    email: values.email.trim(),
    nickname: values.nickname?.trim() || null,
    role: values.role,
    isActive: values.isActive,
    password: values.password?.trim() || null,
  }
}
