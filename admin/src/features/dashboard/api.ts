import { getArticles } from "@/features/article/api"
import { getComments } from "@/features/comment/api"
import { getCategories } from "@/features/category/api"
import { getSiteSetting } from "@/features/settings/api"
import { getTags } from "@/features/tag/api"
import type { Article } from "@/features/article/types"
import type { DashboardOverview } from "@/features/dashboard/types"

function sortByUpdatedAtDesc(items: Article[]): Article[] {
  return [...items].sort(
    (first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
  )
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [articleResponse, commentResponse, categoryResponse, tagResponse, siteSetting] = await Promise.all([
    getArticles(),
    getComments(),
    getCategories(),
    getTags(),
    getSiteSetting(),
  ])

  const articles = articleResponse.items
  const pendingComments = commentResponse.items.filter((item) => item.status === "pending")
  const publishedArticles = articles.filter((article) => article.status === "published")
  const draftArticles = articles.filter((article) => article.status === "draft")
  const topArticles = articles.filter((article) => article.isTop)
  const uncategorizedArticles = articles.filter((article) => article.categoryId === null)
  const sortedArticles = sortByUpdatedAtDesc(articles)
  const sortedDrafts = sortByUpdatedAtDesc(draftArticles)

  return {
    stats: {
      totalArticles: articles.length,
      publishedArticles: publishedArticles.length,
      draftArticles: draftArticles.length,
      topArticles: topArticles.length,
      categoryCount: categoryResponse.items.length,
      tagCount: tagResponse.items.length,
      pendingComments: pendingComments.length,
    },
    publishRate: articles.length ? Math.round((publishedArticles.length / articles.length) * 100) : 0,
    uncategorizedCount: uncategorizedArticles.length,
    latestUpdatedArticles: sortedArticles.slice(0, 5),
    recentDrafts: sortedDrafts.slice(0, 3),
    siteSnapshot: {
      siteName: siteSetting.siteName,
      siteSubtitle: siteSetting.siteSubtitle,
      hasDescription: Boolean(siteSetting.siteDescription?.trim()),
      hasSeoDefaults: Boolean(siteSetting.siteKeywords?.trim()),
    },
  }
}
