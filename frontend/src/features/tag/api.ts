import { apiClient } from "@/api/client"
import type { PublicTagItem } from "@/features/tag/types"
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

interface BackendPublicTagItem {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
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

function normalizeTag(item: BackendPublicTagItem): PublicTagItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    color: item.color,
    articleCount: item.article_count,
    articles: item.articles.map(normalizeArticle),
  }
}

export async function getPublicTags(): Promise<PaginationResponse<PublicTagItem>> {
  const { data } = await apiClient.get<BackendPagination<BackendPublicTagItem>>("/public/tags")

  return {
    total: data.total,
    items: data.items.map(normalizeTag),
  }
}
