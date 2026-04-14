import type { PublicArticleItem } from "@/features/article/types"

export interface ArchiveYearGroup {
  year: string
  entries: PublicArticleItem[]
}
