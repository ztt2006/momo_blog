import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import ConfirmDialog from "@/components/shared/confirmDialog"
import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import ArticleFilterBar from "@/features/article/components/articleFilterBar"
import ArticleTable from "@/features/article/components/articleTable"
import { deleteArticle, getArticles } from "@/features/article/api"
import styles from "@/pages/articleList/index.module.css"
import { APP_ROUTES } from "@/lib/constants"
import type { Article, ArticleListFilters } from "@/features/article/types"

export default function ArticleListPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [filters, setFilters] = useState<ArticleListFilters>({
    keyword: "",
    status: "all",
  })

  useEffect(() => {
    getArticles()
      .then((response) => {
        setArticles(response.items)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取文章列表失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredItems = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesStatus = filters.status === "all" ? true : article.status === filters.status
      const matchesKeyword =
        !keyword ||
        article.title.toLowerCase().includes(keyword) ||
        article.slug.toLowerCase().includes(keyword) ||
        article.summary?.toLowerCase().includes(keyword)

      return matchesStatus && matchesKeyword
    })
  }, [articles, filters])

  async function handleDeleteArticle() {
    if (!articleToDelete) {
      return
    }

    try {
      setDeleting(true)
      await deleteArticle(articleToDelete.id)
      setArticles((current) => current.filter((item) => item.id !== articleToDelete.id))
      setArticleToDelete(null)
      toast.success("文章已删除")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除文章失败")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Article Manager"
        title="文章管理"
        description="集中查看所有草稿和已发布内容，随时回到编辑状态。"
      />

      <ArticleFilterBar
        filters={filters}
        onKeywordChange={(keyword) => setFilters((current) => ({ ...current, keyword }))}
        onStatusChange={(status) => setFilters((current) => ({ ...current, status }))}
        onCreate={() => navigate(APP_ROUTES.articleCreate)}
      />

      {loading ? (
        <Loading text="正在加载文章列表..." />
      ) : (
        <ArticleTable
          items={filteredItems}
          onCreate={() => navigate(APP_ROUTES.articleCreate)}
          onEdit={(articleId) => navigate(`${APP_ROUTES.articles}/${articleId}/edit`)}
          onDelete={(article) => setArticleToDelete(article)}
        />
      )}

      <ConfirmDialog
        open={Boolean(articleToDelete)}
        title="删除这篇文章？"
        description={
          articleToDelete
            ? `《${articleToDelete.title}》会从后台和前台列表中移除，相关评论也会一起删除。`
            : ""
        }
        loading={deleting}
        onConfirm={handleDeleteArticle}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setArticleToDelete(null)
          }
        }}
      />
    </section>
  )
}
