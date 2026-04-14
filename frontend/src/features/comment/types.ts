export interface CommentItem {
  id: number
  authorName: string
  content: string
  createdAt: string
  sourceType: "article" | "guestbook"
  articleSlug: string | null
}

export interface CommentPayload {
  authorName: string
  authorEmail?: string
  content: string
}
