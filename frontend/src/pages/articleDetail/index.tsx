import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import MarkdownRenderer from "@/components/shared/markdownRenderer"
import { Button } from "@/components/ui/button"
import { getPublicArticleDetail } from "@/features/article/api"
import ArticleMeta from "@/features/article/components/articleMeta"
import type { PublicArticleDetail } from "@/features/article/types"
import styles from "@/pages/articleDetail/index.module.css"

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<PublicArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setNotFound(true)
      return
    }

    getPublicArticleDetail(slug)
      .then((response) => {
        setArticle(response)
      })
      .catch(() => {
        setNotFound(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return <Loading text="正在翻开这篇文章..." />
  }

  if (notFound || !article) {
    return (
      <EmptyState
        title="没有找到这篇文章"
        description="它可能还没有发布，或者链接已经发生变化。"
      />
    )
  }

  return (
    <article className={styles.page}>
      <div className={styles.backRow}>
        <Button asChild variant="outline" className={styles.backButton}>
          <Link to="/">返回首页</Link>
        </Button>
      </div>

      <header className={styles.hero}>
        <span className={styles.eyebrow}>Personal note</span>
        <h1 className={styles.title}>{article.title}</h1>
        {article.summary ? <p className={styles.summary}>{article.summary}</p> : null}
        <ArticleMeta
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          wordCount={article.wordCount}
        />
      </header>

      <MarkdownRenderer content={article.contentMd} />
    </article>
  )
}
