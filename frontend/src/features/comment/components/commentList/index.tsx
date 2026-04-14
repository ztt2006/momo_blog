import type { CommentItem } from "@/features/comment/types"
import { formatPublishDate } from "@/lib/formatDate"
import styles from "@/features/comment/components/commentList/index.module.css"

interface CommentListProps {
  items: CommentItem[]
  emptyTitle: string
  emptyDescription: string
}

export default function CommentList({ items, emptyTitle, emptyDescription }: CommentListProps) {
  if (!items.length) {
    return (
      <div className={styles.emptyState}>
        <strong className={styles.emptyTitle}>{emptyTitle}</strong>
        <p className={styles.emptyDescription}>{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <article key={item.id} className={styles.card}>
          <div className={styles.avatar}>{item.authorName.slice(0, 1).toUpperCase()}</div>
          <div className={styles.content}>
            <div className={styles.header}>
              <strong className={styles.author}>{item.authorName}</strong>
              <span className={styles.date}>{formatPublishDate(item.createdAt)}</span>
            </div>
            <p className={styles.text}>{item.content}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
