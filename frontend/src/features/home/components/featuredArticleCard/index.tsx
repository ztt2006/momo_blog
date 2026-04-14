import { Link } from "react-router"

import ArticleMeta from "@/features/article/components/articleMeta"
import styles from "@/features/home/components/featuredArticleCard/index.module.css"
import type { PublicArticleItem } from "@/features/article/types"

export default function FeaturedArticleCard({ article }: { article: PublicArticleItem }) {
  return (
    <article className={styles.card}>
      <span className={styles.eyebrow}>Featured note</span>
      <div className={styles.content}>
        <Link className={styles.title} to={`/articles/${article.slug}`}>
          {article.title}
        </Link>
        <p className={styles.summary}>
          {article.summary || "这是最近最值得回看的那篇文章，适合从这里开始读。"}
        </p>
      </div>
      <ArticleMeta
        publishedAt={article.publishedAt}
        readingTime={article.readingTime}
        wordCount={article.wordCount}
      />
    </article>
  )
}
