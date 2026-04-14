import { z } from "zod"

import type { SiteSetting, SiteSettingSubmitPayload } from "@/features/settings/types"

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const siteSettingFormSchema = z.object({
  siteName: z.string().trim().min(1, "请输入站点名称").max(120, "站点名称不超过 120 字"),
  siteSubtitle: z.string().trim().max(255, "站点副标题不超过 255 字"),
  siteDescription: z.string().trim().max(500, "站点描述不超过 500 字"),
  siteKeywords: z.string().trim().max(255, "SEO 关键词不超过 255 字"),
  logo: z.string().trim().max(500, "Logo 链接不超过 500 字"),
  favicon: z.string().trim().max(500, "Favicon 链接不超过 500 字"),
  githubUrl: z
    .string()
    .trim()
    .max(500, "GitHub 链接不超过 500 字")
    .refine((value) => !value || /^https?:\/\//i.test(value), "请输入以 http:// 或 https:// 开头的链接"),
  aboutMarkdown: z.string().trim(),
  icp: z.string().trim().max(255, "备案信息不超过 255 字"),
  publicEmail: z
    .string()
    .trim()
    .max(255, "公开邮箱不超过 255 字")
    .refine((value) => !value || isEmail(value), "请输入正确的邮箱地址"),
})

export const siteBasicsFormSchema = siteSettingFormSchema.pick({
  siteName: true,
  siteSubtitle: true,
  siteDescription: true,
  githubUrl: true,
  aboutMarkdown: true,
  icp: true,
  publicEmail: true,
})

export const seoSettingsFormSchema = siteSettingFormSchema.pick({
  siteKeywords: true,
  logo: true,
  favicon: true,
})

export type SiteSettingFormValues = z.infer<typeof siteSettingFormSchema>
export type SiteBasicsFormValues = z.infer<typeof siteBasicsFormSchema>
export type SeoSettingsFormValues = z.infer<typeof seoSettingsFormSchema>

function emptyToNull(value?: string): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function getSiteSettingFormDefaultValues(setting?: SiteSetting): SiteSettingFormValues {
  return {
    siteName: setting?.siteName ?? "",
    siteSubtitle: setting?.siteSubtitle ?? "",
    siteDescription: setting?.siteDescription ?? "",
    siteKeywords: setting?.siteKeywords ?? "",
    logo: setting?.logo ?? "",
    favicon: setting?.favicon ?? "",
    githubUrl: setting?.githubUrl ?? "",
    aboutMarkdown: setting?.aboutMarkdown ?? "",
    icp: setting?.icp ?? "",
    publicEmail: setting?.publicEmail ?? "",
  }
}

export function getSiteBasicsFormDefaultValues(setting?: SiteSetting): SiteBasicsFormValues {
  const defaults = getSiteSettingFormDefaultValues(setting)

  return {
    siteName: defaults.siteName,
    siteSubtitle: defaults.siteSubtitle,
    siteDescription: defaults.siteDescription,
    githubUrl: defaults.githubUrl,
    aboutMarkdown: defaults.aboutMarkdown,
    icp: defaults.icp,
    publicEmail: defaults.publicEmail,
  }
}

export function getSeoSettingsFormDefaultValues(setting?: SiteSetting): SeoSettingsFormValues {
  const defaults = getSiteSettingFormDefaultValues(setting)

  return {
    siteKeywords: defaults.siteKeywords,
    logo: defaults.logo,
    favicon: defaults.favicon,
  }
}

export function createSiteSettingSubmitPayload(
  values: SiteSettingFormValues
): SiteSettingSubmitPayload {
  return {
    siteName: values.siteName.trim(),
    siteSubtitle: emptyToNull(values.siteSubtitle),
    siteDescription: emptyToNull(values.siteDescription),
    siteKeywords: emptyToNull(values.siteKeywords),
    logo: emptyToNull(values.logo),
    favicon: emptyToNull(values.favicon),
    githubUrl: emptyToNull(values.githubUrl),
    aboutMarkdown: emptyToNull(values.aboutMarkdown),
    icp: emptyToNull(values.icp),
    publicEmail: emptyToNull(values.publicEmail),
  }
}
