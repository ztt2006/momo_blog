import ArticleCard from "@/features/article/components/articleCard"
import TagChip from "@/features/tag/components/tagChip"
import styles from "@/features/tag/components/tagArticleList/index.module.css"
import type { PublicTagItem } from "@/features/tag/types"

interface TagArticleListProps {
  items: PublicTagItem[]
}

export default function TagArticleList({ items }: TagArticleListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <section key={item.id} id={item.slug} className={styles.section}>
          <header className={styles.header}>
            <div className={styles.copy}>
              <TagChip name={item.name} slug={item.slug} color={item.color} />
              {item.description ? <p className={styles.description}>{item.description}</p> : null}
            </div>
            <span className={styles.count}>{item.articleCount} 篇</span>
          </header>

          <div className={styles.articles}>
            {item.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
