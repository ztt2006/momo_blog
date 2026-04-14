import { AxiosError } from "axios"

import { apiClient } from "@/api/client"
import type { SiteSetting, SiteSettingSubmitPayload } from "@/features/settings/types"
import type { ApiErrorResponse } from "@/types/apiTypes"

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
    logo: setting.logo,
    favicon: setting.favicon,
    githubUrl: setting.github_url,
    aboutMarkdown: setting.about_markdown,
    icp: setting.icp,
    publicEmail: setting.public_email,
  }
}

function toBackendPayload(payload: SiteSettingSubmitPayload) {
  return {
    site_name: payload.siteName,
    site_subtitle: payload.siteSubtitle,
    site_description: payload.siteDescription,
    site_keywords: payload.siteKeywords,
    logo: payload.logo,
    favicon: payload.favicon,
    github_url: payload.githubUrl,
    about_markdown: payload.aboutMarkdown,
    icp: payload.icp,
    public_email: payload.publicEmail,
  }
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.detail ?? fallback
}

export async function getSiteSetting(): Promise<SiteSetting> {
  try {
    const { data } = await apiClient.get<BackendSiteSetting>("/admin/site-settings")
    return normalizeSiteSetting(data)
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "获取站点设置失败"))
  }
}

export async function updateSiteSetting(payload: SiteSettingSubmitPayload): Promise<SiteSetting> {
  try {
    const { data } = await apiClient.put<BackendSiteSetting>(
      "/admin/site-settings",
      toBackendPayload(payload)
    )

    return normalizeSiteSetting(data)
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "保存站点设置失败"))
  }
}
