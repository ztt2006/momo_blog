export type ArticleStatus = "draft" | "published"

export interface Article {
  id: number
  title: string
  slug: string
  summary: string | null
  contentMd: string
  status: ArticleStatus
  categoryId: number | null
  coverImageId: number | null
  authorId: number
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  isTop: boolean
  allowComment: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tagIds: number[]
}

export interface ArticleListFilters {
  keyword: string
  status: "all" | ArticleStatus
}

export interface ArticleSubmitPayload {
  title: string
  slug: string
  summary: string | null
  contentMd: string
  status: ArticleStatus
  categoryId: number | null
  coverImageId: number | null
  tagIds: number[]
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  isTop: boolean
  allowComment: boolean
  publishedAt: string | null
}
