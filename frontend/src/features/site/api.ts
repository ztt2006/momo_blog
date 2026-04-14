import { apiClient } from "@/api/client"
import type { SiteSetting } from "@/features/site/types"
import { resolveAssetUrl } from "@/lib/assetUrl"

interface BackendSiteSetting {
  id: number
  site_name: string
  site_subtitle: string | null
  site_description: string | null
  site_keywords: string | null
  logo: string | null
  favicon: string | null
  github_url: string | null
  about_markdown: string | null
  icp: string | null
  public_email: string | null
}

function normalizeSiteSetting(setting: BackendSiteSetting): SiteSetting {
  return {
    id: setting.id,
    siteName: setting.site_name,
    siteSubtitle: setting.site_subtitle,
    siteDescription: setting.site_description,
    siteKeywords: setting.site_keywords,
    logo: resolveAssetUrl(setting.logo),
    favicon: resolveAssetUrl(setting.favicon),
    githubUrl: setting.github_url,
    aboutMarkdown: setting.about_markdown,
    icp: setting.icp,
    publicEmail: setting.public_email,
  }
}

export async function getPublicSiteSetting(): Promise<SiteSetting> {
  const { data } = await apiClient.get<BackendSiteSetting>("/public/site-settings")
  return normalizeSiteSetting(data)
}
