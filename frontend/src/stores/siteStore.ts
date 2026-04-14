import { create } from "zustand"

import { getPublicSiteSetting } from "@/features/site/api"
import type { SiteSetting } from "@/features/site/types"

interface SiteState {
  siteSetting: SiteSetting
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  setSiteSetting: (siteSetting: SiteSetting) => void
  loadSiteSetting: () => Promise<SiteSetting>
}

export function getDefaultSiteSetting(): SiteSetting {
  return {
    id: 0,
    siteName: "Momo Notes",
    siteSubtitle: "写给未来的自己，也偶尔分享给路过的人。",
    siteDescription: "一个慢慢生长的个人博客，记录技术、项目和日常思考。",
    siteKeywords: "个人博客,技术笔记,React,FastAPI",
    logo: null,
    favicon: null,
    githubUrl: null,
    aboutMarkdown: "## 关于这个博客\n\n这里记录长期可回看的技术笔记与项目复盘。",
    icp: null,
    publicEmail: null,
  }
}

export const useSiteStore = create<SiteState>((set, get) => ({
  siteSetting: getDefaultSiteSetting(),
  isLoading: false,
  hasLoaded: false,
  error: null,
  setSiteSetting: (siteSetting) => {
    set({
      siteSetting,
      hasLoaded: true,
      isLoading: false,
      error: null,
    })
  },
  loadSiteSetting: async () => {
    if (get().isLoading) {
      return get().siteSetting
    }

    set({
      isLoading: true,
      error: null,
    })

    try {
      const siteSetting = await getPublicSiteSetting()
      set({
        siteSetting,
        isLoading: false,
        hasLoaded: true,
        error: null,
      })

      return siteSetting
    } catch (error) {
      const fallback = getDefaultSiteSetting()
      set({
        siteSetting: fallback,
        isLoading: false,
        hasLoaded: true,
        error: error instanceof Error ? error.message : "获取站点信息失败",
      })

      return fallback
    }
  },
}))
