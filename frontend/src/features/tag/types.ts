import type { PublicArticleItem } from "@/features/article/types"

export interface PublicTagItem {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  articleCount: number
  articles: PublicArticleItem[]
}
