import { Link } from "react-router"

import ArticleMeta from "@/features/article/components/articleMeta"
import styles from "@/features/article/components/articleCard/index.module.css"
import type { PublicArticleItem } from "@/features/article/types"

export default function ArticleCard({ article }: { article: PublicArticleItem }) {
  return (
    <article className={styles.card}>
      <div className={styles.topLine}>
        <span className={styles.dot} />
        <span className={styles.label}>Note</span>
      </div>
      <div className={styles.body}>
        <Link className={styles.link} to={`/articles/${article.slug}`}>
          {article.title}
        </Link>
        <p className={styles.summary}>{article.summary || "这篇文章还没有摘要，但已经被认真写下来了。"}</p>
      </div>
      <ArticleMeta
        publishedAt={article.publishedAt}
        readingTime={article.readingTime}
        wordCount={article.wordCount}
      />
    </article>
  )
}
