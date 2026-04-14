import { z } from "zod"

import type { ProfileUpdatePayload, ProfileUser } from "@/features/profile/types"

export const profileFormSchema = z.object({
  email: z.email("请输入正确的邮箱地址"),
  nickname: z.string().trim().max(100, "昵称不超过 100 字"),
  bio: z.string().trim().max(2000, "简介不超过 2000 字"),
  password: z.string().max(128, "密码不超过 128 位"),
  avatarFile: z.custom<File | null>((value) => value === null || value instanceof File, {
    message: "请选择有效的头像文件",
  }),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

function emptyToNull(value?: string): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function getProfileFormDefaultValues(user?: ProfileUser | null): ProfileFormValues {
  return {
    email: user?.email ?? "",
    nickname: user?.nickname ?? "",
    bio: user?.bio ?? "",
    password: "",
    avatarFile: null,
  }
}

export function createProfileUpdatePayload(values: ProfileFormValues): ProfileUpdatePayload {
  return {
    email: values.email.trim(),
    nickname: emptyToNull(values.nickname),
    bio: emptyToNull(values.bio),
    password: emptyToNull(values.password),
  }
}
