import ArticleCard from "@/features/article/components/articleCard"
import styles from "@/features/category/components/categoryArticleList/index.module.css"
import type { PublicCategoryItem } from "@/features/category/types"

interface CategoryArticleListProps {
  items: PublicCategoryItem[]
}

export default function CategoryArticleList({ items }: CategoryArticleListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <section key={item.id} id={item.slug} className={styles.section}>
          <header className={styles.header}>
            <div className={styles.copy}>
              <h3 className={styles.title}>{item.name}</h3>
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
