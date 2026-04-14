import { create } from "zustand"

import type { AuthSession, AuthUser } from "@/features/auth/types"
import { AUTH_STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, removeStorageItem, setStorageItem } from "@/lib/storage"

interface AuthState {
  token: string | null
  user: AuthUser | null
  isHydrated: boolean
  setSession: (session: AuthSession) => void
  clearSession: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  setSession: ({ token, user }) => {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
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
    const user = getStorageItem<AuthUser>(AUTH_STORAGE_KEYS.user)

    set({
      token,
      user,
      isHydrated: true,
    })
  },
}))
