import { BookOpenText, FolderTree, PenSquare, Settings2, Tags } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getDashboardOverview } from "@/features/dashboard/api"
import styles from "@/features/dashboard/components/dashboardOverview/index.module.css"
import type { DashboardOverview as DashboardOverviewType } from "@/features/dashboard/types"
import { APP_ROUTES } from "@/lib/constants"

const metricConfigs = [
  { key: "totalArticles", label: "文章总数", hint: "当前后台已收录内容" },
  { key: "publishedArticles", label: "已发布", hint: "前台可见内容" },
  { key: "draftArticles", label: "草稿", hint: "还在整理中的笔记" },
  { key: "topArticles", label: "置顶文章", hint: "首页优先展示" },
  { key: "categoryCount", label: "分类数", hint: "长期主题组织" },
  { key: "tagCount", label: "标签数", hint: "细粒度索引线索" },
  { key: "pendingComments", label: "待审核评论", hint: "需要你处理的互动内容" },
] as const

const quickActions = [
  { label: "写新文章", to: APP_ROUTES.articleCreate, icon: PenSquare },
  { label: "查看文章列表", to: APP_ROUTES.articles, icon: BookOpenText },
  { label: "整理分类", to: APP_ROUTES.categories, icon: FolderTree },
  { label: "整理标签", to: APP_ROUTES.tags, icon: Tags },
  { label: "去审核评论", to: APP_ROUTES.comments, icon: BookOpenText },
  { label: "管理站点设置", to: APP_ROUTES.settings, icon: Settings2 },
] as const

function formatDateTime(value: string | null): string {
  if (!value) {
    return "未发布"
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default function DashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverviewType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getDashboardOverview()
      .then((response) => {
        if (!cancelled) {
          setOverview(response)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "加载仪表盘失败")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <Loading text="正在整理后台概览..." />
  }

  if (!overview) {
    return (
      <EmptyState
        title="仪表盘暂时不可用"
        description="没有拿到概览数据，请稍后刷新重试。"
      />
    )
  }

  return (
    <div className={styles.layout}>
      <section className={styles.metricGrid}>
        {metricConfigs.map((item) => (
          <Card key={item.key} className={styles.metricCard}>
            <CardContent className={styles.metricContent}>
              <div className={styles.metricValue}>{overview.stats[item.key]}</div>
              <div className={styles.metricCopy}>
                <p className={styles.metricLabel}>{item.label}</p>
                <p className={styles.metricHint}>{item.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className={styles.mainGrid}>
        <Card className={styles.panelCard}>
          <CardHeader className={styles.panelHeader}>
            <CardTitle className={styles.panelTitle}>最近更新</CardTitle>
            <CardDescription className={styles.panelDescription}>
              优先展示最近被你编辑过的内容，方便继续接着写。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.panelContent}>
            {overview.latestUpdatedArticles.length ? (
              <div className={styles.articleList}>
                {overview.latestUpdatedArticles.map((article) => (
                  <Link key={article.id} to={`${APP_ROUTES.articles}/${article.id}/edit`} className={styles.articleItem}>
                    <div className={styles.articleTop}>
                      <strong className={styles.articleTitle}>{article.title}</strong>
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>
                        {article.status === "published" ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                    <p className={styles.articleMeta}>
                      最近更新于 {formatDateTime(article.updatedAt)} · {article.categoryId ? "已分类" : "未分类"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="还没有文章"
                description="从第一篇文章开始，仪表盘会慢慢长成你的写作工作台。"
                actionLabel="写新文章"
                onAction={() => {
                  window.location.href = APP_ROUTES.articleCreate
                }}
              />
            )}
          </CardContent>
        </Card>

        <div className={styles.sideStack}>
          <Card className={styles.panelCard}>
            <CardHeader className={styles.panelHeader}>
              <CardTitle className={styles.panelTitle}>发布进度</CardTitle>
              <CardDescription className={styles.panelDescription}>
                看看当前内容结构有没有失衡，决定下一步是继续写还是先整理。
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.panelContent}>
              <div className={styles.progressHero}>
                <strong className={styles.progressValue}>{overview.publishRate}%</strong>
                <span className={styles.progressLabel}>文章已发布</span>
              </div>
              <div className={styles.progressBar}>
                <span className={styles.progressFill} style={{ width: `${overview.publishRate}%` }} />
              </div>
              <div className={styles.progressMeta}>
                <p>草稿 {overview.stats.draftArticles} 篇</p>
                <p>未分类 {overview.uncategorizedCount} 篇</p>
              </div>
              {overview.recentDrafts.length ? (
                <>
                  <Separator />
                  <div className={styles.draftList}>
                    {overview.recentDrafts.map((article) => (
                      <Link
                        key={article.id}
                        className={styles.draftItem}
                        to={`${APP_ROUTES.articles}/${article.id}/edit`}
                      >
                        <span>{article.title}</span>
                        <span className={styles.draftDate}>{formatDateTime(article.updatedAt)}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card className={styles.panelCard}>
            <CardHeader className={styles.panelHeader}>
              <CardTitle className={styles.panelTitle}>站点状态</CardTitle>
            </CardHeader>
            <CardContent className={styles.panelContent}>
              <div className={styles.siteSnapshot}>
                <strong className={styles.siteName}>{overview.siteSnapshot.siteName}</strong>
                <p className={styles.siteSubtitle}>
                  {overview.siteSnapshot.siteSubtitle || "还没有站点副标题，可以去设置里补充。"}
                </p>
              </div>
              <div className={styles.statusList}>
                <div className={styles.statusRow}>
                  <span>站点描述</span>
                  <Badge variant={overview.siteSnapshot.hasDescription ? "default" : "secondary"}>
                    {overview.siteSnapshot.hasDescription ? "已配置" : "待补充"}
                  </Badge>
                </div>
                <div className={styles.statusRow}>
                  <span>默认 SEO</span>
                  <Badge variant={overview.siteSnapshot.hasSeoDefaults ? "default" : "secondary"}>
                    {overview.siteSnapshot.hasSeoDefaults ? "已配置" : "待补充"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.panelCard}>
            <CardHeader className={styles.panelHeader}>
              <CardTitle className={styles.panelTitle}>快捷入口</CardTitle>
            </CardHeader>
            <CardContent className={styles.quickActionGrid}>
              {quickActions.map((item) => {
                const Icon = item.icon

                return (
                  <Button key={item.to} asChild variant="outline" className={styles.quickActionButton}>
                    <Link to={item.to}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
