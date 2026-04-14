import { getPublicArticles } from "@/features/article/api"
import type { ArchiveYearGroup } from "@/features/archive/types"

export async function getArchiveEntries(): Promise<ArchiveYearGroup[]> {
  const { items } = await getPublicArticles()
  const groups = new Map<string, typeof items>()

  for (const item of items) {
    const year = item.publishedAt ? new Date(item.publishedAt).getFullYear().toString() : "未归档"
    const currentItems = groups.get(year) ?? []
    currentItems.push(item)
    groups.set(year, currentItems)
  }

  return Array.from(groups.entries())
    .sort((left, right) => Number(right[0]) - Number(left[0]))
    .map(([year, entries]) => ({
      year,
      entries,
    }))
}
