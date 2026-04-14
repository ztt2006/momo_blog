import { Badge } from "@/components/ui/badge"
import styles from "@/features/article/components/articleStatusBadge/index.module.css"
import { classNames } from "@/lib/classNames"
import type { ArticleStatus } from "@/features/article/types"

const statusText: Record<ArticleStatus, string> = {
  draft: "草稿",
  published: "已发布",
}

export default function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <Badge
      variant="outline"
      className={classNames(styles.badge, status === "published" ? styles.published : styles.draft)}
    >
      {statusText[status]}
    </Badge>
  )
}
