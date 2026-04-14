import { Link } from "react-router"

import EmptyState from "@/components/shared/emptyState"
import styles from "@/pages/notFound/index.module.css"
import { APP_ROUTES } from "@/lib/constants"

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <EmptyState
        title="页面不存在"
        description="这个后台地址没有对应内容，返回文章列表继续工作会更快。"
        actionLabel="回到文章列表"
        onAction={() => {
          window.location.href = APP_ROUTES.articles
        }}
      />
      <Link className={styles.link} to={APP_ROUTES.articles}>
        或者点击这里返回文章列表
      </Link>
    </div>
  )
}
