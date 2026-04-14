import PageHeader from "@/components/shared/pageHeader"
import { Button } from "@/components/ui/button"
import DashboardOverview from "@/features/dashboard/components/dashboardOverview"
import styles from "@/pages/dashboard/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import { Link } from "react-router"

export default function DashboardPage() {
  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Overview"
        title="后台首页"
        description="把最近的写作状态、内容结构和站点配置集中放在一页，方便你每天快速进入工作状态。"
        actions={
          <Button asChild>
            <Link to={APP_ROUTES.articleCreate}>写新文章</Link>
          </Button>
        }
      />

      <DashboardOverview />
    </section>
  )
}
