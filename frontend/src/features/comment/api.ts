import { apiClient } from "@/api/client"
import type { CommentItem, CommentPayload } from "@/features/comment/types"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendCommentItem {
  id: number
  author_name: string
  content: string
  created_at: string
  source_type: "article" | "guestbook"
  article_slug: string | null
}

interface BackendPagination<T> {
  total: number
  items: T[]
}

function normalizeComment(item: BackendCommentItem): CommentItem {
  return {
    id: item.id,
    authorName: item.author_name,
    content: item.content,
    createdAt: item.created_at,
    sourceType: item.source_type,
    articleSlug: item.article_slug,
  }
}

function serializePayload(payload: CommentPayload) {
  return {
    author_name: payload.authorName,
    author_email: payload.authorEmail ?? null,
    content: payload.content,
  }
}

export async function getArticleComments(slug: string): Promise<PaginationResponse<CommentItem>> {
  const { data } = await apiClient.get<BackendPagination<BackendCommentItem>>(`/public/articles/${slug}/comments`)

  return {
    total: data.total,
    items: data.items.map(normalizeComment),
  }
}

export async function createArticleComment(slug: string, payload: CommentPayload): Promise<CommentItem> {
  const { data } = await apiClient.post<BackendCommentItem>(
    `/public/articles/${slug}/comments`,
    serializePayload(payload)
  )

  return normalizeComment(data)
}

export async function getGuestbookMessages(): Promise<PaginationResponse<CommentItem>> {
  const { data } = await apiClient.get<BackendPagination<BackendCommentItem>>("/public/messages")

  return {
    total: data.total,
    items: data.items.map(normalizeComment),
  }
}

export async function createGuestbookMessage(payload: CommentPayload): Promise<CommentItem> {
  const { data } = await apiClient.post<BackendCommentItem>("/public/messages", serializePayload(payload))
  return normalizeComment(data)
}
