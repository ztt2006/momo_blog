export interface PublicArticleItem {
  id: number
  title: string
  slug: string
  summary: string | null
  publishedAt: string | null
  readingTime: number
  wordCount: number
  coverImageId: number | null
}

export interface PublicArticleDetail extends PublicArticleItem {
  contentMd: string
}
