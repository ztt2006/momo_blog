import { create } from "zustand"

import type { PublicAuthSession, PublicAuthUser } from "@/features/auth/types"
import { AUTH_STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, removeStorageItem, setStorageItem } from "@/lib/storage"

interface PublicAuthState {
  token: string | null
  user: PublicAuthUser | null
  isHydrated: boolean
  setSession: (session: PublicAuthSession) => void
  clearSession: () => void
  hydrate: () => void
}

export const usePublicAuthStore = create<PublicAuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  setSession: ({ token, user }) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
    }
    setStorageItem(AUTH_STORAGE_KEYS.user, user)
    set({
      token,
      user,
      isHydrated: true,
    })
  },
  clearSession: () => {
    removeStorageItem(AUTH_STORAGE_KEYS.token)
    removeStorageItem(AUTH_STORAGE_KEYS.user)
    set({
      token: null,
      user: null,
      isHydrated: true,
    })
  },
  hydrate: () => {
    const token =
      typeof window === "undefined" ? null : window.localStorage.getItem(AUTH_STORAGE_KEYS.token)
    const user = getStorageItem<PublicAuthUser>(AUTH_STORAGE_KEYS.user)

    set({
      token,
      user,
      isHydrated: true,
    })
  },
}))
