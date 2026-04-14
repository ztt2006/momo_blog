import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import styles from "@/components/shared/emptyState/index.module.css"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.iconBox}>
        <FileText />
      </div>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      {actionLabel ? (
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  )
}
