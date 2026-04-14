import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useState } from "react"

import PageHeader from "@/components/shared/pageHeader"
import ArticleForm from "@/features/article/components/articleForm"
import { createArticle } from "@/features/article/api"
import styles from "@/pages/articleCreate/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import type { ArticleSubmitPayload } from "@/features/article/types"

export default function ArticleCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(payload: ArticleSubmitPayload) {
    try {
      setSubmitting(true)
      const article = await createArticle(payload)
      toast.success("文章已创建")
      navigate(`${APP_ROUTES.articles}/${article.id}/edit`, { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建文章失败")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Create"
        title="新建文章"
        description="现在可以直接补分类和标签了，写完后就能更顺手地归档内容。"
      />
      <ArticleForm mode="create" submitting={submitting} onSubmit={handleSubmit} />
    </section>
  )
}
