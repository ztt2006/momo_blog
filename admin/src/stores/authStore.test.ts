import { beforeEach, describe, expect, it } from "vitest"

import type { AuthUser } from "@/features/auth/types"
import { AUTH_STORAGE_KEYS } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

const demoUser: AuthUser = {
  id: 1,
  username: "momo",
  email: "momo@example.com",
  nickname: "Momo",
  avatar: null,
  role: "admin",
  isActive: true,
}

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clearSession()
  })

  it("hydrates token and user from localStorage", () => {
    localStorage.setItem(AUTH_STORAGE_KEYS.token, "demo-token")
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(demoUser))

    useAuthStore.getState().hydrate()

    expect(useAuthStore.getState().token).toBe("demo-token")
    expect(useAuthStore.getState().user).toEqual(demoUser)
    expect(useAuthStore.getState().isHydrated).toBe(true)
  })

  it("persists session when setSession is called", () => {
    useAuthStore.getState().setSession({
      token: "fresh-token",
      user: demoUser,
    })

    expect(localStorage.getItem(AUTH_STORAGE_KEYS.token)).toBe("fresh-token")
    expect(localStorage.getItem(AUTH_STORAGE_KEYS.user)).toBe(JSON.stringify(demoUser))
  })

  it("clears memory and storage on logout", () => {
    useAuthStore.getState().setSession({
      token: "fresh-token",
      user: demoUser,
    })

    useAuthStore.getState().clearSession()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(localStorage.getItem(AUTH_STORAGE_KEYS.token)).toBeNull()
    expect(localStorage.getItem(AUTH_STORAGE_KEYS.user)).toBeNull()
  })
})
