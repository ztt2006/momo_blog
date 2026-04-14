import { AxiosError } from "axios"

import { apiClient } from "@/api/client"
import type { CommentItem, CommentStatus } from "@/features/comment/types"
import type { ApiErrorResponse } from "@/types/apiTypes"
import type { PaginationResponse } from "@/types/paginationTypes"

interface BackendCommentItem {
  id: number
  author_name: string
  author_email: string | null
  content: string
  created_at: string
  status: CommentStatus
  source_type: "article" | "guestbook"
  article_id: number | null
  article_title: string | null
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
    authorEmail: item.author_email,
    content: item.content,
    createdAt: item.created_at,
    status: item.status,
    sourceType: item.source_type,
    articleId: item.article_id,
    articleTitle: item.article_title,
    articleSlug: item.article_slug,
  }
}

function resolveErrorMessage(error: unknown, fallback: string): Error {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return new Error(axiosError.response?.data?.detail ?? fallback)
}

export async function getComments(): Promise<PaginationResponse<CommentItem>> {
  try {
    const { data } = await apiClient.get<BackendPagination<BackendCommentItem>>("/admin/comments")
    return {
      total: data.total,
      items: data.items.map(normalizeComment),
    }
  } catch (error) {
    throw resolveErrorMessage(error, "获取评论列表失败")
  }
}

export async function updateCommentStatus(commentId: number, status: CommentStatus): Promise<CommentItem> {
  try {
    const { data } = await apiClient.put<BackendCommentItem>(`/admin/comments/${commentId}`, {
      status,
    })
    return normalizeComment(data)
  } catch (error) {
    throw resolveErrorMessage(error, "更新评论状态失败")
  }
}
