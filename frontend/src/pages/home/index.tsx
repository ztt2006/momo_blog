import { useEffect, useState } from "react"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import SectionTitle from "@/components/shared/sectionTitle"
import { getPublicArticles } from "@/features/article/api"
import type { PublicArticleItem } from "@/features/article/types"
import FeaturedArticleCard from "@/features/home/components/featuredArticleCard"
import HeroSection from "@/features/home/components/heroSection"
import LatestArticleList from "@/features/home/components/latestArticleList"
import styles from "@/pages/home/index.module.css"

export default function HomePage() {
  const [items, setItems] = useState<PublicArticleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicArticles()
      .then((response) => {
        setItems(response.items)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const [featured, ...latest] = items

  return (
    <div className={styles.page}>
      <HeroSection />

      {loading ? <Loading text="正在整理最近写下的内容..." /> : null}

      {!loading && !items.length ? (
        <EmptyState
          title="还没有公开文章"
          description="先去后台发布第一篇文章吧。发布完成后，这里会像一本慢慢变厚的个人笔记一样长出来。"
        />
      ) : null}

      {!loading && featured ? (
        <section className={styles.section}>
          <SectionTitle
            eyebrow="Latest highlight"
            title="最近最想留住的一页"
            description="先从这一篇开始读，通常它代表了我最近最在意、也最想反复回看的内容。"
          />
          <FeaturedArticleCard article={featured} />
        </section>
      ) : null}

      {!loading && latest.length ? (
        <section className={styles.section} id="latest">
          <SectionTitle
            eyebrow="Latest notes"
            title="最新文章"
            description="这些是最近陆续整理好的记录，保留项目推进过程里的细节，也保留当下的心情。"
          />
          <LatestArticleList items={latest} />
        </section>
      ) : null}
    </div>
  )
}
