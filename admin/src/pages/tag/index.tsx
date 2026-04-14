import { useEffect, useState } from "react"
import { toast } from "sonner"

import Loading from "@/components/shared/loading"
import PageHeader from "@/components/shared/pageHeader"
import { Button } from "@/components/ui/button"
import { createTag, getTags, updateTag } from "@/features/tag/api"
import TagForm from "@/features/tag/components/tagForm"
import TagTable from "@/features/tag/components/tagTable"
import styles from "@/pages/tag/index.module.css"
import type { Tag, TagSubmitPayload } from "@/features/tag/types"

function sortTags(items: Tag[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN"))
}

export default function TagPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<Tag[]>([])
  const [editingTag, setEditingTag] = useState<Tag>()

  useEffect(() => {
    getTags()
      .then((response) => {
        setItems(sortTags(response.items))
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "获取标签失败")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function handleSubmit(payload: TagSubmitPayload) {
    try {
      setSubmitting(true)

      if (editingTag) {
        const updated = await updateTag(editingTag.id, payload)
        setItems((current) => sortTags(current.map((item) => (item.id === updated.id ? updated : item))))
        setEditingTag(undefined)
        toast.success("标签已更新")
        return
      }

      const created = await createTag(payload)
      setItems((current) => sortTags([...current, created]))
      toast.success("标签已创建")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存标签失败")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Tag System"
        title="标签管理"
        description="标签负责补充检索维度，适合描述技术点、系列主题和阅读关键词。"
        actions={
          editingTag ? (
            <Button variant="outline" onClick={() => setEditingTag(undefined)}>
              新建标签
            </Button>
          ) : null
        }
      />

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <TagForm
            mode={editingTag ? "edit" : "create"}
            tag={editingTag}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingTag(undefined)}
          />
        </div>

        <div className={styles.listColumn}>
          {loading ? (
            <Loading text="正在加载标签..." />
          ) : (
            <TagTable
              items={items}
              onEdit={(tag) => setEditingTag(tag)}
              onCreate={() => setEditingTag(undefined)}
            />
          )}
        </div>
      </div>
    </section>
  )
}
