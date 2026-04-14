import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import MarkdownRenderer from "@/components/shared/markdownRenderer"
import { Button } from "@/components/ui/button"
import { getPublicArticleDetail } from "@/features/article/api"
import ArticleCard from "@/features/article/components/articleCard"
import ArticleMeta from "@/features/article/components/articleMeta"
import ArticleNavigator from "@/features/article/components/articleNavigator"
import ArticleToc from "@/features/article/components/articleToc"
import CategoryBadge from "@/features/category/components/categoryBadge"
import ArticleCommentSection from "@/features/comment/components/articleCommentSection"
import TagChip from "@/features/tag/components/tagChip"
import { applyDocumentSeo, buildPageTitle } from "@/lib/seo"
import type { PublicArticleDetail } from "@/features/article/types"
import styles from "@/pages/articleDetail/index.module.css"
import { useSiteStore } from "@/stores/siteStore"

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<PublicArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const siteSetting = useSiteStore((state) => state.siteSetting)

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

  useEffect(() => {
    if (!article) {
      return
    }

    applyDocumentSeo({
      title: buildPageTitle(article.title, siteSetting.siteName),
      description: article.summary ?? siteSetting.siteDescription ?? undefined,
      keywords: siteSetting.siteKeywords ?? undefined,
    })
  }, [article, siteSetting.siteDescription, siteSetting.siteKeywords, siteSetting.siteName])

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
        {article.coverImageUrl ? (
          <div className={styles.coverFrame}>
            <img className={styles.coverImage} src={article.coverImageUrl} alt={article.title} />
          </div>
        ) : null}
        <ArticleMeta
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          wordCount={article.wordCount}
        />
        {article.category || article.tags.length ? (
          <div className={styles.taxonomy}>
            {article.category ? (
              <div className={styles.taxonomyBlock}>
                <span className={styles.taxonomyLabel}>分类</span>
                <CategoryBadge name={article.category.name} slug={article.category.slug} />
              </div>
            ) : null}

            {article.tags.length ? (
              <div className={styles.taxonomyBlock}>
                <span className={styles.taxonomyLabel}>标签</span>
                <div className={styles.tagList}>
                  {article.tags.map((tag) => (
                    <TagChip key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          <MarkdownRenderer content={article.contentMd} />
        </div>
        <aside className={styles.sideColumn}>
          <ArticleToc items={article.toc} />
        </aside>
      </div>

      <ArticleNavigator
        previousArticle={article.previousArticle}
        nextArticle={article.nextArticle}
      />

      <ArticleCommentSection slug={article.slug} enabled={article.allowComment} />

      {article.relatedArticles.length ? (
        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <span className={styles.eyebrow}>Related notes</span>
            <h2 className={styles.relatedTitle}>继续阅读</h2>
          </div>
          <div className={styles.relatedGrid}>
            {article.relatedArticles.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
