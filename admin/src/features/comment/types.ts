export type CommentSourceType = "article" | "guestbook"
export type CommentStatus = "pending" | "approved" | "rejected"

export interface CommentItem {
  id: number
  authorName: string
  authorEmail: string | null
  content: string
  createdAt: string
  status: CommentStatus
  sourceType: CommentSourceType
  articleId: number | null
  articleTitle: string | null
  articleSlug: string | null
}

export interface CommentFilters {
  keyword: string
  sourceType: "all" | CommentSourceType
  status: "all" | CommentStatus
}
