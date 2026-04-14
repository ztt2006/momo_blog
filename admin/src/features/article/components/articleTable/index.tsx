import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"

import EmptyState from "@/components/shared/emptyState"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ArticleStatusBadge from "@/features/article/components/articleStatusBadge"
import styles from "@/features/article/components/articleTable/index.module.css"
import { formatDateTime } from "@/lib/formatDate"
import type { Article } from "@/features/article/types"

interface ArticleTableProps {
  items: Article[]
  onEdit: (articleId: number) => void
  onCreate: () => void
  onDelete: (article: Article) => void
}

export default function ArticleTable({ items, onEdit, onCreate, onDelete }: ArticleTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="还没有文章"
        description="先写第一篇文章吧，保存草稿后就能回到这里继续编辑和发布。"
        actionLabel="创建第一篇文章"
        onAction={onCreate}
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>更新时间</TableHead>
            <TableHead>发布时间</TableHead>
            <TableHead className={styles.actionHead}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={styles.titleCell}>
                <div className={styles.titleGroup}>
                  <button className={styles.titleButton} type="button" onClick={() => onEdit(item.id)}>
                    {item.title}
                  </button>
                  <span className={styles.slug}>{item.slug}</span>
                </div>
              </TableCell>
              <TableCell>
                <ArticleStatusBadge status={item.status} />
              </TableCell>
              <TableCell>{formatDateTime(item.updatedAt)}</TableCell>
              <TableCell>{formatDateTime(item.publishedAt)}</TableCell>
              <TableCell className={styles.actionCell}>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`文章 ${item.title} 的更多操作`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>
                      <PencilLine />
                      编辑文章
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={styles.deleteItem}
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 />
                      删除文章
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
