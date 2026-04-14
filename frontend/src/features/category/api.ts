import { apiClient } from "@/api/client"
import type { PublicCategoryItem } from "@/features/category/types"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendPublicArticleItem {
  id: number
  title: string
  slug: string
  summary: string | null
  published_at: string | null
  reading_time: number
  word_count: number
  cover_image_id: number | null
}

interface BackendPublicCategoryItem {
  id: number
  name: string
  slug: string
  description: string | null
  sort_order: number
  article_count: number
  articles: BackendPublicArticleItem[]
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeArticle(item: BackendPublicArticleItem) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    publishedAt: item.published_at,
    readingTime: item.reading_time,
    wordCount: item.word_count,
    coverImageId: item.cover_image_id,
  }
}

function normalizeCategory(item: BackendPublicCategoryItem): PublicCategoryItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    sortOrder: item.sort_order,
    articleCount: item.article_count,
    articles: item.articles.map(normalizeArticle),
  }
}

export async function getPublicCategories(): Promise<PaginationResponse<PublicCategoryItem>> {
  const { data } = await apiClient.get<BackendPagination<BackendPublicCategoryItem>>("/public/categories")

  return {
    total: data.total,
    items: data.items.map(normalizeCategory),
  }
}
