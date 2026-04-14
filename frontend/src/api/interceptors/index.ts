import type { AxiosInstance } from "axios"

export function registerInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use((response) => response, (error) => Promise.reject(error))
}
