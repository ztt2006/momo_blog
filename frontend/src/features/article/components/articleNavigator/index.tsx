import { Link } from "react-router"

import styles from "@/features/article/components/articleNavigator/index.module.css"
import type { PublicArticleItem } from "@/features/article/types"

interface ArticleNavigatorProps {
  previousArticle: PublicArticleItem | null
  nextArticle: PublicArticleItem | null
}

function NavigatorCard({
  label,
  article,
}: {
  label: string
  article: PublicArticleItem | null
}) {
  if (!article) {
    return (
      <div className={styles.cardMuted}>
        <span className={styles.label}>{label}</span>
        <p className={styles.empty}>暂时没有了</p>
      </div>
    )
  }

  return (
    <Link className={styles.card} to={`/articles/${article.slug}`}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.title}>{article.title}</strong>
      <p className={styles.summary}>{article.summary || "继续读下一页。"}</p>
    </Link>
  )
}

export default function ArticleNavigator({
  previousArticle,
  nextArticle,
}: ArticleNavigatorProps) {
  return (
    <section className={styles.section}>
      <NavigatorCard label="上一篇" article={previousArticle} />
      <NavigatorCard label="下一篇" article={nextArticle} />
    </section>
  )
}
