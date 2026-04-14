import { useEffect, useState } from "react"

import Loading from "@/components/shared/loading"
import { createArticleComment, getArticleComments } from "@/features/comment/api"
import CommentForm from "@/features/comment/components/commentForm"
import CommentList from "@/features/comment/components/commentList"
import type { CommentItem, CommentPayload } from "@/features/comment/types"
import styles from "@/features/comment/components/articleCommentSection/index.module.css"

interface ArticleCommentSectionProps {
  slug: string
  enabled: boolean
}

export default function ArticleCommentSection({ slug, enabled }: ArticleCommentSectionProps) {
  const [items, setItems] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getArticleComments(slug)
      .then((response) => {
        if (!cancelled) {
          setItems(response.items)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "评论加载失败，请稍后再试。")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  async function handleSubmit(payload: CommentPayload) {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      await createArticleComment(slug, payload)
      setSuccessMessage("评论已经收下了，审核通过后会显示在这里。")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "评论提交失败，请稍后再试。")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Discussion</span>
        <div className={styles.copy}>
          <h2 className={styles.title}>评论</h2>
          <p className={styles.description}>
            适合补充问题、提出不同观点，或者留下你实践后的结果。
          </p>
        </div>
        <span className={styles.count}>{items.length} 条</span>
      </div>

      {enabled ? (
        <CommentForm
          authorLabel="你的名字"
          emailLabel="电子邮箱"
          contentLabel="评论内容"
          submitLabel="提交评论"
          contentPlaceholder="写下你的想法、疑问，或者补充一条你自己的实践经验。"
          submitting={submitting}
          successMessage={successMessage}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className={styles.notice}>
          这篇文章暂时关闭评论，更适合安静阅读。如果你想联系我，可以去关于页留言。
        </div>
      )}

      {loading ? (
        <Loading text="正在展开评论区..." />
      ) : (
        <CommentList
          items={items}
          emptyTitle="还没有评论"
          emptyDescription="你可以成为第一个留下阅读反馈的人。"
        />
      )}
    </section>
  )
}
