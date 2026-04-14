import { useEffect, useState } from "react"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import { Button } from "@/components/ui/button"
import {
  createCategory,
  getCategories,
  updateCategory,
} from "@/features/category/api"
import CategoryForm from "@/features/category/components/categoryForm"
import CategoryTable from "@/features/category/components/categoryTable"
import styles from "@/pages/category/index.module.css"
import type { Category, CategorySubmitPayload } from "@/features/category/types"

function sortCategories(items: Category[]) {
  return [...items].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "zh-Hans-CN")
  )
}

export default function CategoryPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category>()

  useEffect(() => {
    getCategories()
      .then((response) => {
        setItems(sortCategories(response.items))
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取分类失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function handleSubmit(payload: CategorySubmitPayload) {
    try {
      setSubmitting(true)

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload)
        setItems((current) =>
          sortCategories(current.map((item) => (item.id === updated.id ? updated : item)))
        )
        setEditingCategory(undefined)
        toast.success("分类已更新")
        return
      }

      const created = await createCategory(payload)
      setItems((current) => sortCategories([...current, created]))
      toast.success("分类已创建")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存分类失败")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Taxonomy"
        title="分类管理"
        description="分类负责搭建内容主干，适合长期稳定的主题结构。"
        actions={
          editingCategory ? (
            <Button variant="outline" onClick={() => setEditingCategory(undefined)}>
              新建分类
            </Button>
          ) : null
        }
      />

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <CategoryForm
            mode={editingCategory ? "edit" : "create"}
            category={editingCategory}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingCategory(undefined)}
          />
        </div>

        <div className={styles.listColumn}>
          {loading ? (
            <Loading text="正在加载分类..." />
          ) : (
            <CategoryTable
              items={items}
              onEdit={(category) => setEditingCategory(category)}
              onCreate={() => setEditingCategory(undefined)}
            />
          )}
        </div>
      </div>
    </section>
  )
}
