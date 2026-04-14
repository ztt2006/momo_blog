import { apiClient } from "@/api/client"
import type { PublicArticleDetail, PublicArticleItem } from "@/features/article/types"
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

interface BackendPublicArticleDetail extends BackendPublicArticleItem {
  content_md: string
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeItem(item: BackendPublicArticleItem): PublicArticleItem {
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

export async function getPublicArticles(): Promise<PaginationResponse<PublicArticleItem>> {
  const { data } = await apiClient.get<BackendPagination<BackendPublicArticleItem>>("/public/articles")

  return {
    total: data.total,
    items: data.items.map(normalizeItem),
  }
}

export async function getPublicArticleDetail(slug: string): Promise<PublicArticleDetail> {
  const { data } = await apiClient.get<BackendPublicArticleDetail>(`/public/articles/${slug}`)

  return {
    ...normalizeItem(data),
    contentMd: data.content_md,
  }
}
