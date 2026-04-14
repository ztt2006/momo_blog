const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"
const apiOrigin = new URL(apiBaseUrl).origin

function normalizeAssetValue(value: string): string {
  return value.replace(/[\s\u200B-\u200D\uFEFF]+/g, "")
}

export function resolveAssetUrl(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const normalizedValue = normalizeAssetValue(value)

  if (!normalizedValue) {
    return null
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue
  }

  return new URL(normalizedValue, apiOrigin).toString()
}
