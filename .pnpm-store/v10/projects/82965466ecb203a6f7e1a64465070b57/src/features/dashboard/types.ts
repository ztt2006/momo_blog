import type { Article } from "@/features/article/types"

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  topArticles: number
  categoryCount: number
  tagCount: number
  pendingComments: number
}

export interface SiteSnapshot {
  siteName: string
  siteSubtitle: string | null
  hasDescription: boolean
  hasSeoDefaults: boolean
}

export interface DashboardOverview {
  stats: DashboardStats
  publishRate: number
  uncategorizedCount: number
  latestUpdatedArticles: Article[]
  recentDrafts: Article[]
  siteSnapshot: SiteSnapshot
}
