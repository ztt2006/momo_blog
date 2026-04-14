import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import { Card, CardContent } from "@/components/ui/card"
import { getComments, updateCommentStatus } from "@/features/comment/api"
import CommentFilterBar from "@/features/comment/components/commentFilterBar"
import CommentTable from "@/features/comment/components/commentTable"
import styles from "@/features/comment/components/commentModerationBoard/index.module.css"
import type { CommentFilters, CommentItem, CommentStatus } from "@/features/comment/types"

export default function CommentModerationBoard() {
  const [items, setItems] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [filters, setFilters] = useState<CommentFilters>({
    keyword: "",
    sourceType: "all",
    status: "all",
  })

  useEffect(() => {
    getComments()
      .then((response) => {
        setItems(response.items)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "加载评论失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredItems = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSource = filters.sourceType === "all" || item.sourceType === filters.sourceType
      const matchesStatus = filters.status === "all" || item.status === filters.status
      const matchesKeyword =
        !keyword ||
        item.authorName.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.articleTitle?.toLowerCase().includes(keyword) ||
        item.authorEmail?.toLowerCase().includes(keyword)

      return matchesSource && matchesStatus && matchesKeyword
    })
  }, [filters, items])

  const metrics = useMemo(() => {
    const articleCount = items.filter((item) => item.sourceType === "article").length
    const guestbookCount = items.filter((item) => item.sourceType === "guestbook").length
    const pendingCount = items.filter((item) => item.status === "pending").length
    const rejectedCount = items.filter((item) => item.status === "rejected").length

    return {
      total: items.length,
      articleCount,
      guestbookCount,
      pendingCount,
      rejectedCount,
    }
  }, [items])

  async function handleChangeStatus(commentId: number, status: CommentStatus) {
    try {
      setActionId(commentId)
      const updated = await updateCommentStatus(commentId, status)
      setItems((current) => current.map((item) => (item.id === commentId ? updated : item)))
      toast.success(
        status === "approved" ? "互动内容已通过审核" : status === "rejected" ? "互动内容已屏蔽" : "状态已更新为待审核"
      )
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新状态失败")
    } finally {
      setActionId(null)
    }
  }

  if (loading) {
    return <Loading text="正在整理评论与留言..." />
  }

  return (
    <div className={styles.layout}>
      <section className={styles.metricGrid}>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{metrics.total}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>总互动</p>
              <p className={styles.metricHint}>包含文章评论和关于页留言</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{metrics.articleCount}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>文章评论</p>
              <p className={styles.metricHint}>直接来自文章详情页的讨论</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{metrics.guestbookCount}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>站点留言</p>
              <p className={styles.metricHint}>来自关于页留言板的近况与反馈</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{metrics.pendingCount}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>待审核</p>
              <p className={styles.metricHint}>新提交但尚未公开展示的互动内容</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{metrics.rejectedCount}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>已屏蔽</p>
              <p className={styles.metricHint}>已被隐藏，不会出现在前台公开页面</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <CommentFilterBar
        filters={filters}
        onKeywordChange={(keyword) => setFilters((current) => ({ ...current, keyword }))}
        onSourceTypeChange={(sourceType) => setFilters((current) => ({ ...current, sourceType }))}
        onStatusChange={(status) => setFilters((current) => ({ ...current, status }))}
      />

      <CommentTable items={filteredItems} onChangeStatus={handleChangeStatus} loadingActionId={actionId} />
    </div>
  )
}
