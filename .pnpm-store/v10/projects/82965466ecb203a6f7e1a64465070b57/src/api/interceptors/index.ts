import type { AxiosError, AxiosInstance } from "axios"

import { APP_ROUTES, AUTH_STORAGE_KEYS } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"
import type { ApiErrorResponse } from "@/types/apiTypes"

let isRegistered = false

export function registerInterceptors(client: AxiosInstance): void {
  if (isRegistered) {
    return
  }

  client.interceptors.request.use((config) => {
    const token =
      useAuthStore.getState().token ??
      (typeof window === "undefined" ? null : window.localStorage.getItem(AUTH_STORAGE_KEYS.token))

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearSession()

        if (typeof window !== "undefined" && window.location.pathname !== APP_ROUTES.login) {
          window.location.href = APP_ROUTES.login
        }
      }

      return Promise.reject(error)
    }
  )

  isRegistered = true
}
