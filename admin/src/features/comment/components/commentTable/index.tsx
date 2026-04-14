import { EyeOff, MessagesSquare } from "lucide-react"

import EmptyState from "@/components/shared/emptyState"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CommentStatusBadge from "@/features/comment/components/commentStatusBadge"
import styles from "@/features/comment/components/commentTable/index.module.css"
import { formatDateTime } from "@/lib/formatDate"
import type { CommentItem, CommentStatus } from "@/features/comment/types"

interface CommentTableProps {
  items: CommentItem[]
  onChangeStatus: (commentId: number, status: CommentStatus) => void
  loadingActionId?: number | null
}

export default function CommentTable({ items, onChangeStatus, loadingActionId = null }: CommentTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="还没有需要处理的互动"
        description="等读者开始评论文章或在关于页留言之后，这里就会出现完整记录。"
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>作者与内容</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>提交时间</TableHead>
            <TableHead className={styles.actionHead}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const busy = loadingActionId === item.id
            const sourceLabel = item.sourceType === "article" ? "文章评论" : "站点留言"

            return (
              <TableRow key={item.id}>
                <TableCell className={styles.mainCell}>
                  <div className={styles.authorBlock}>
                    <div className={styles.authorRow}>
                      <strong className={styles.authorName}>{item.authorName}</strong>
                      {item.authorEmail ? <span className={styles.authorEmail}>{item.authorEmail}</span> : null}
                    </div>
                    <p className={styles.content}>{item.content}</p>
                  </div>
                </TableCell>
                <TableCell className={styles.sourceCell}>
                  <div className={styles.sourceBlock}>
                    <span className={styles.sourceLabel}>{sourceLabel}</span>
                    {item.articleTitle ? <span className={styles.articleTitle}>{item.articleTitle}</span> : null}
                  </div>
                </TableCell>
                <TableCell>
                  <CommentStatusBadge status={item.status} />
                </TableCell>
                <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                <TableCell className={styles.actionCell}>
                  {item.status === "pending" ? (
                    <div className={styles.actionGroup}>
                      <Button
                        type="button"
                        variant="secondary"
                        className={styles.actionButton}
                        disabled={busy}
                        onClick={() => onChangeStatus(item.id, "approved")}
                      >
                        <MessagesSquare />
                        通过
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={styles.actionButton}
                        disabled={busy}
                        onClick={() => onChangeStatus(item.id, "rejected")}
                      >
                        <EyeOff />
                        屏蔽
                      </Button>
                    </div>
                  ) : item.status === "approved" ? (
                    <Button
                      type="button"
                      variant="outline"
                      className={styles.actionButton}
                      disabled={busy}
                      onClick={() => onChangeStatus(item.id, "rejected")}
                    >
                      <EyeOff />
                      屏蔽
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className={styles.actionButton}
                      disabled={busy}
                      onClick={() => onChangeStatus(item.id, "approved")}
                    >
                      <MessagesSquare />
                      恢复展示
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
