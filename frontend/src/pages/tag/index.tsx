import { useEffect, useState } from "react"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import SectionTitle from "@/components/shared/sectionTitle"
import { getPublicTags } from "@/features/tag/api"
import TagArticleList from "@/features/tag/components/tagArticleList"
import TagCloud from "@/features/tag/components/tagCloud"
import type { PublicTagItem } from "@/features/tag/types"
import styles from "@/pages/tag/index.module.css"

export default function TagPage() {
  const [items, setItems] = useState<PublicTagItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicTags()
      .then((response) => {
        setItems(response.items)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section className={styles.page}>
      <SectionTitle
        eyebrow="Tags"
        title="按标签检索"
        description="标签更像细粒度索引，适合快速找到某个技术点、某段系列写作，或者一组分散但相关的记录。"
      />

      {loading ? <Loading text="正在整理标签..." /> : null}

      {!loading && !items.length ? (
        <EmptyState
          title="标签页暂时还是空的"
          description="后面写作越多，这里越像一份可以随时回溯的索引卡片盒。"
        />
      ) : null}

      {!loading && items.length ? (
        <>
          <TagCloud items={items} />
          <TagArticleList items={items} />
        </>
      ) : null}
    </section>
  )
}
