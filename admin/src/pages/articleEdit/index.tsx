import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import ArticleForm from "@/features/article/components/articleForm"
import { getArticleDetail, updateArticle } from "@/features/article/api"
import styles from "@/pages/articleEdit/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import type { Article, ArticleSubmitPayload } from "@/features/article/types"

export default function ArticleEditPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [article, setArticle] = useState<Article>()
  const articleId = Number(params.articleId)

  useEffect(() => {
    if (!articleId) {
      navigate(APP_ROUTES.articles, { replace: true })
      return
    }

    getArticleDetail(articleId)
      .then((response) => {
        setArticle(response)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取文章详情失败")
        navigate(APP_ROUTES.articles, { replace: true })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [articleId, navigate])

  async function handleSubmit(payload: ArticleSubmitPayload) {
    if (!articleId) {
      return
    }

    try {
      setSubmitting(true)
      const updatedArticle = await updateArticle(articleId, payload)
      setArticle(updatedArticle)
      toast.success("文章已保存")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading text="正在加载文章内容..." />
  }

  if (!article) {
    return null
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Edit"
        title={article.title}
        description="修改内容后点击保存，当前页会保持在编辑状态。"
      />
      <ArticleForm mode="edit" article={article} submitting={submitting} onSubmit={handleSubmit} />
    </section>
  )
}
