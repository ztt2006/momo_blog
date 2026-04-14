import styles from "@/features/article/components/articleMeta/index.module.css"
import { formatPublishDate } from "@/lib/formatDate"

interface ArticleMetaProps {
  publishedAt: string | null
  readingTime: number
  wordCount: number
}

export default function ArticleMeta({ publishedAt, readingTime, wordCount }: ArticleMetaProps) {
  return (
    <div className={styles.meta}>
      <span>{formatPublishDate(publishedAt)}</span>
      <span>{readingTime} 分钟阅读</span>
      <span>{wordCount} 字</span>
    </div>
  )
}
