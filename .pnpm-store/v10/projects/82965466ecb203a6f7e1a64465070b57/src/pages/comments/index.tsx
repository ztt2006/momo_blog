import PageHeader from "@/components/shared/pageHeader"
import CommentModerationBoard from "@/features/comment/components/commentModerationBoard"
import styles from "@/pages/comments/index.module.css"

export default function CommentsPage() {
  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Comments Review"
        title="评论与留言审核"
        description="统一查看文章评论和站点留言，决定哪些内容继续展示，哪些内容先暂时隐藏。"
      />

      <CommentModerationBoard />
    </section>
  )
}
