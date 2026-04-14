export interface PublicArticleItem {
  id: number
  title: string
  slug: string
  summary: string | null
  publishedAt: string | null
  readingTime: number
  wordCount: number
  coverImageId: number | null
  coverImageUrl?: string | null
}

export interface PublicArticleCategory {
  id: number
  name: string
  slug: string
}

export interface PublicArticleTag {
  id: number
  name: string
  slug: string
  color: string | null
}

export interface ArticleTocItem {
  id: string
  text: string
  level: number
}

export interface PublicArticleDetail extends PublicArticleItem {
  contentMd: string
  category: PublicArticleCategory | null
  tags: PublicArticleTag[]
  toc: ArticleTocItem[]
  previousArticle: PublicArticleItem | null
  nextArticle: PublicArticleItem | null
  relatedArticles: PublicArticleItem[]
  allowComment: boolean
}
