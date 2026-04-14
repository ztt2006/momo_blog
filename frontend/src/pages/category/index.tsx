import { useEffect, useState } from "react"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import SectionTitle from "@/components/shared/sectionTitle"
import { getPublicCategories } from "@/features/category/api"
import CategoryArticleList from "@/features/category/components/categoryArticleList"
import CategoryNav from "@/features/category/components/categoryNav"
import type { PublicCategoryItem } from "@/features/category/types"
import styles from "@/pages/category/index.module.css"

export default function CategoryPage() {
  const [items, setItems] = useState<PublicCategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicCategories()
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
        eyebrow="Categories"
        title="按分类浏览"
        description="分类是内容的主干，更适合长期沉淀的主题结构。你可以先看关心的方向，再进入具体文章。"
      />

      {loading ? <Loading text="正在整理分类内容..." /> : null}

      {!loading && !items.length ? (
        <EmptyState
          title="分类页暂时还是空的"
          description="等文章慢慢积累起来，这里会形成一张更清晰的主题地图。"
        />
      ) : null}

      {!loading && items.length ? (
        <>
          <CategoryNav items={items} />
          <CategoryArticleList items={items} />
        </>
      ) : null}
    </section>
  )
}
