const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"
const apiOrigin = new URL(apiBaseUrl).origin

export function resolveAssetUrl(value?: string | null): string | null {
  if (!value) {
    return null
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return new URL(value, apiOrigin).toString()
}
