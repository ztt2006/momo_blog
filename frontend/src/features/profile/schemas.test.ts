import { describe, expect, it } from "vitest"

import {
  createProfileUpdatePayload,
  getProfileFormDefaultValues,
  profileFormSchema,
} from "@/features/profile/schemas"
import type { ProfileUser } from "@/features/profile/types"

describe("frontend profile schemas", () => {
  it("rejects invalid email", () => {
    const result = profileFormSchema.safeParse({
      ...getProfileFormDefaultValues(),
      email: "invalid-email",
    })

    expect(result.success).toBe(false)
  })

  it("normalizes optional fields before submit", () => {
    const payload = createProfileUpdatePayload({
      email: " reader@example.com ",
      nickname: " Reader ",
      bio: " 这里是一些阅读备注 ",
      password: "",
      avatarFile: null,
    })

    expect(payload).toEqual({
      email: "reader@example.com",
      nickname: "Reader",
      bio: "这里是一些阅读备注",
      password: null,
    })
  })

  it("maps current user to form defaults", () => {
    const profile: ProfileUser = {
      id: 5,
      username: "reader01",
      email: "reader01@example.com",
      nickname: "Reader 01",
      avatar: "/uploads/reader.png",
      bio: "前台普通用户",
      role: "user",
      isActive: true,
    }

    expect(getProfileFormDefaultValues(profile)).toEqual({
      email: "reader01@example.com",
      nickname: "Reader 01",
      bio: "前台普通用户",
      password: "",
      avatarFile: null,
    })
  })
})
