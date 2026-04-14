import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CommentFilters } from "@/features/comment/types"
import styles from "@/features/comment/components/commentFilterBar/index.module.css"

interface CommentFilterBarProps {
  filters: CommentFilters
  onKeywordChange: (keyword: string) => void
  onSourceTypeChange: (sourceType: CommentFilters["sourceType"]) => void
  onStatusChange: (status: CommentFilters["status"]) => void
}

export default function CommentFilterBar({
  filters,
  onKeywordChange,
  onSourceTypeChange,
  onStatusChange,
}: CommentFilterBarProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} />
        <Input
          value={filters.keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          className={styles.searchInput}
          placeholder="搜索昵称、内容、文章标题"
        />
      </div>

      <div className={styles.selectGroup}>
        <Select value={filters.sourceType} onValueChange={onSourceTypeChange}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="全部来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="article">文章评论</SelectItem>
            <SelectItem value="guestbook">站点留言</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={onStatusChange}>
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="approved">展示中</SelectItem>
            <SelectItem value="rejected">已屏蔽</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
