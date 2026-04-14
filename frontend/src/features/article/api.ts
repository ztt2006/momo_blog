import { apiClient } from "@/api/client"
import type {
  ArticleTocItem,
  PublicArticleCategory,
  PublicArticleDetail,
  PublicArticleItem,
  PublicArticleTag,
} from "@/features/article/types"
import { resolveAssetUrl } from "@/lib/assetUrl"
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
  cover_image_url: string | null
}

interface BackendPublicArticleDetail extends BackendPublicArticleItem {
  content_md: string
  allow_comment: boolean
  category: {
    id: number
    name: string
    slug: string
  } | null
  tags: Array<{
    id: number
    name: string
    slug: string
    color: string | null
  }>
  toc: Array<{
    id: string
    text: string
    level: number
  }>
  previous_article: BackendPublicArticleItem | null
  next_article: BackendPublicArticleItem | null
  related_articles: BackendPublicArticleItem[]
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
    coverImageUrl: resolveAssetUrl(item.cover_image_url),
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

  const category: PublicArticleCategory | null = data.category
    ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
      }
    : null

  const tags: PublicArticleTag[] = data.tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
  }))

  const toc: ArticleTocItem[] = data.toc.map((item) => ({
    id: item.id,
    text: item.text,
    level: item.level,
  }))

  return {
    ...normalizeItem(data),
    contentMd: data.content_md,
    category,
    tags,
    toc,
    previousArticle: data.previous_article ? normalizeItem(data.previous_article) : null,
    nextArticle: data.next_article ? normalizeItem(data.next_article) : null,
    relatedArticles: data.related_articles.map(normalizeItem),
    allowComment: data.allow_comment,
  }
}
