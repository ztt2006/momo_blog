import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/features/article/components/articleFilterBar/index.module.css"
import type { ArticleListFilters } from "@/features/article/types"

interface ArticleFilterBarProps {
  filters: ArticleListFilters
  onKeywordChange: (keyword: string) => void
  onStatusChange: (status: ArticleListFilters["status"]) => void
  onCreate: () => void
}

export default function ArticleFilterBar({
  filters,
  onKeywordChange,
  onStatusChange,
  onCreate,
}: ArticleFilterBarProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            value={filters.keyword}
            placeholder="搜索标题、slug 或摘要"
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>

        <Select value={filters.status} onValueChange={onStatusChange}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="文章状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
          </SelectContent>
        </Select>

        <Button className={styles.createButton} type="button" onClick={onCreate}>
          <Plus />
          新建文章
        </Button>
      </div>
    </Card>
  )
}
