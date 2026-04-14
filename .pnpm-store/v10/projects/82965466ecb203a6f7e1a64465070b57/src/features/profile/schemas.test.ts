import { describe, expect, it } from "vitest"

import {
  createProfileUpdatePayload,
  getProfileFormDefaultValues,
  profileFormSchema,
} from "@/features/profile/schemas"
import type { ProfileUser } from "@/features/profile/types"

describe("admin profile schemas", () => {
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
      bio: " 记录自己的写作节奏 ",
      password: "",
      avatarFile: null,
    })

    expect(payload).toEqual({
      email: "reader@example.com",
      nickname: "Reader",
      bio: "记录自己的写作节奏",
      password: null,
    })
  })

  it("maps current user to form defaults", () => {
    const profile: ProfileUser = {
      id: 2,
      username: "editor",
      email: "editor@example.com",
      nickname: "Editor",
      avatar: "/uploads/editor.png",
      bio: "后台写作用户",
      role: "admin",
      isActive: true,
    }

    expect(getProfileFormDefaultValues(profile)).toEqual({
      email: "editor@example.com",
      nickname: "Editor",
      bio: "后台写作用户",
      password: "",
      avatarFile: null,
    })
  })
})
