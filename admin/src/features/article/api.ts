import { apiClient } from "@/api/client"
import type { Article, ArticleSubmitPayload } from "@/features/article/types"
import { resolveAssetUrl } from "@/lib/assetUrl"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendArticle {
  id: number
  title: string
  slug: string
  summary: string | null
  content_md: string
  status: "draft" | "published"
  category_id: number | null
  cover_image_id: number | null
  cover_image_url: string | null
  author_id: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  is_top: boolean
  allow_comment: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  tag_ids: number[]
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeArticle(article: BackendArticle): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    contentMd: article.content_md,
    status: article.status,
    categoryId: article.category_id,
    coverImageId: article.cover_image_id,
    coverImageUrl: resolveAssetUrl(article.cover_image_url),
    authorId: article.author_id,
    seoTitle: article.seo_title,
    seoDescription: article.seo_description,
    seoKeywords: article.seo_keywords,
    isTop: article.is_top,
    allowComment: article.allow_comment,
    publishedAt: article.published_at,
    createdAt: article.created_at,
    updatedAt: article.updated_at,
    tagIds: article.tag_ids,
  }
}

function toBackendPayload(payload: ArticleSubmitPayload) {
  return {
    title: payload.title,
    slug: payload.slug,
    summary: payload.summary,
    content_md: payload.contentMd,
    status: payload.status,
    category_id: payload.categoryId,
    cover_image_id: payload.coverImageId,
    tag_ids: payload.tagIds,
    seo_title: payload.seoTitle,
    seo_description: payload.seoDescription,
    seo_keywords: payload.seoKeywords,
    is_top: payload.isTop,
    allow_comment: payload.allowComment,
    published_at: payload.publishedAt,
  }
}

export async function getArticles(): Promise<PaginationResponse<Article>> {
  const { data } = await apiClient.get<BackendPagination<BackendArticle>>("/admin/articles")

  return {
    total: data.total,
    items: data.items.map(normalizeArticle),
  }
}

export async function getArticleDetail(articleId: number): Promise<Article> {
  const { data } = await apiClient.get<BackendArticle>(`/admin/articles/${articleId}`)
  return normalizeArticle(data)
}

export async function createArticle(payload: ArticleSubmitPayload): Promise<Article> {
  const { data } = await apiClient.post<BackendArticle>("/admin/articles", toBackendPayload(payload))
  return normalizeArticle(data)
}

export async function updateArticle(articleId: number, payload: ArticleSubmitPayload): Promise<Article> {
  const { data } = await apiClient.put<BackendArticle>(
    `/admin/articles/${articleId}`,
    toBackendPayload(payload)
  )

  return normalizeArticle(data)
}
