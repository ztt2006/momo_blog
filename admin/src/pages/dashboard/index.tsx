import { Link } from "react-router"

import PageHeader from "@/components/shared/pageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import styles from "@/pages/dashboard/index.module.css"
import { APP_ROUTES } from "@/lib/constants"

export default function DashboardPage() {
  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Overview"
        title="后台首页"
        description="这里先保留一个轻量入口，你可以直接进入文章管理开始写作。"
        actions={
          <Button asChild>
            <Link to={APP_ROUTES.articleCreate}>写新文章</Link>
          </Button>
        }
      />

      <Card className={styles.card}>
        <CardContent className={styles.content}>
          <p className={styles.text}>
            当前优先把登录、文章列表和编辑器跑通。后续我们可以继续补仪表盘统计、分类、标签、媒体库和设置。
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
