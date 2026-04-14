import { useEffect, useState } from "react"

import Loading from "@/components/shared/loading"
import { createGuestbookMessage, getGuestbookMessages } from "@/features/comment/api"
import CommentForm from "@/features/comment/components/commentForm"
import CommentList from "@/features/comment/components/commentList"
import type { CommentItem, CommentPayload } from "@/features/comment/types"
import styles from "@/features/comment/components/guestbookSection/index.module.css"

export default function GuestbookSection() {
  const [items, setItems] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getGuestbookMessages()
      .then((response) => {
        if (!cancelled) {
          setItems(response.items)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "留言加载失败，请稍后再试。")
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
  }, [])

  async function handleSubmit(payload: CommentPayload) {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      await createGuestbookMessage(payload)
      setSuccessMessage("留言已经收到，审核通过后会展示在留言板。")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "留言提交失败，请稍后再试。")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Guestbook</span>
        <h2 className={styles.title}>留言板</h2>
        <p className={styles.description}>
          如果你也在慢慢整理自己的知识体系，或者只是路过这里，欢迎留下今天的片刻想法。
        </p>
      </div>

      <CommentForm
        authorLabel="留言昵称"
        emailLabel="留言邮箱"
        contentLabel="留言内容"
        submitLabel="提交留言"
        contentPlaceholder="可以写一句问候、交换一个方向，或者告诉我你最近在做什么。"
        submitting={submitting}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <Loading text="正在翻看最近的留言..." />
      ) : (
        <CommentList
          items={items}
          emptyTitle="留言板刚刚打开"
          emptyDescription="第一条留言可以是一句简单的问候，也可以是一段最近的近况。"
        />
      )}
    </section>
  )
}
