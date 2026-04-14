interface DocumentSeoPayload {
  title: string
  description?: string
  keywords?: string
}

function upsertMeta(name: string, content?: string) {
  if (typeof document === "undefined") {
    return
  }

  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement("meta")
    meta.setAttribute("name", name)
    document.head.appendChild(meta)
  }

  meta.setAttribute("content", content ?? "")
}

export function buildPageTitle(pageTitle: string | null | undefined, siteName: string): string {
  return pageTitle ? `${pageTitle} | ${siteName}` : siteName
}

export function applyDocumentSeo({ title, description, keywords }: DocumentSeoPayload): void {
  if (typeof document === "undefined") {
    return
  }

  document.title = title
  upsertMeta("description", description)
  upsertMeta("keywords", keywords)
}
