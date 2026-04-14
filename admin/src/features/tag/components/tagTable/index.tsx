import { PencilLine, Trash2 } from "lucide-react"

import EmptyState from "@/components/shared/emptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import styles from "@/features/tag/components/tagTable/index.module.css"
import type { Tag } from "@/features/tag/types"

interface TagTableProps {
  items: Tag[]
  onEdit: (tag: Tag) => void
  onCreate: () => void
  onDelete: (tag: Tag) => void
}

export default function TagTable({ items, onEdit, onCreate, onDelete }: TagTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="还没有标签"
        description="标签会让文章检索和聚合更灵活，可以先从常写的主题词开始。"
        actionLabel="创建第一个标签"
        onAction={onCreate}
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标签</TableHead>
            <TableHead>链接</TableHead>
            <TableHead>颜色</TableHead>
            <TableHead className={styles.actionHead}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={styles.nameCell}>
                <div className={styles.nameGroup}>
                  <span className={styles.name}>{item.name}</span>
                  {item.description ? <span className={styles.description}>{item.description}</span> : null}
                </div>
              </TableCell>
              <TableCell className={styles.slug}>{item.slug}</TableCell>
              <TableCell>
                {item.color ? (
                  <Badge variant="outline" className={styles.colorBadge}>
                    {item.color}
                  </Badge>
                ) : (
                  <span className={styles.emptyColor}>未设置</span>
                )}
              </TableCell>
              <TableCell className={styles.actionCell}>
                <div className={styles.actions}>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    <PencilLine />
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className={styles.deleteButton} onClick={() => onDelete(item)}>
                    <Trash2 />
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
