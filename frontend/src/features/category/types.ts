import type { PublicArticleItem } from "@/features/article/types"

export interface PublicCategoryItem {
  id: number
  name: string
  slug: string
  description: string | null
  sortOrder: number
  articleCount: number
  articles: PublicArticleItem[]
}
