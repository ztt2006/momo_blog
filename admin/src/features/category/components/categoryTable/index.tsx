import { PencilLine } from "lucide-react"

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
import styles from "@/features/category/components/categoryTable/index.module.css"
import { classNames } from "@/lib/classNames"
import type { Category } from "@/features/category/types"

interface CategoryTableProps {
  items: Category[]
  onEdit: (category: Category) => void
  onCreate: () => void
}

export default function CategoryTable({ items, onEdit, onCreate }: CategoryTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        title="还没有分类"
        description="先创建几个长期主题，后面写文章时就能快速归档。"
        actionLabel="创建第一个分类"
        onAction={onCreate}
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>分类</TableHead>
            <TableHead>链接</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>状态</TableHead>
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
              <TableCell>{item.sortOrder}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={classNames(styles.statusBadge, item.isVisible ? styles.visible : styles.hidden)}
                >
                  {item.isVisible ? "已显示" : "已隐藏"}
                </Badge>
              </TableCell>
              <TableCell className={styles.actionCell}>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <PencilLine />
                  编辑
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
