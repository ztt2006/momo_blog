import type { AxiosInstance } from "axios"

export function registerInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const token =
      typeof window === "undefined" ? null : window.localStorage.getItem("momo_blog_public_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  client.interceptors.response.use((response) => response, (error) => Promise.reject(error))
}
