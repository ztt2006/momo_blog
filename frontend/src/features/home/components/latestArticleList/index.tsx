import ArticleCard from "@/features/article/components/articleCard"
import styles from "@/features/home/components/latestArticleList/index.module.css"
import type { PublicArticleItem } from "@/features/article/types"

export default function LatestArticleList({ items }: { items: PublicArticleItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <ArticleCard key={item.id} article={item} />
      ))}
    </div>
  )
}
