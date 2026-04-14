import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createTagSubmitPayload,
  getTagFormDefaultValues,
  tagFormSchema,
  type TagFormValues,
} from "@/features/tag/schemas"
import styles from "@/features/tag/components/tagForm/index.module.css"
import type { Tag } from "@/features/tag/types"

interface TagFormProps {
  mode: "create" | "edit"
  tag?: Tag
  submitting?: boolean
  onSubmit: (payload: ReturnType<typeof createTagSubmitPayload>) => Promise<void> | void
  onCancelEdit?: () => void
}

export default function TagForm({
  mode,
  tag,
  submitting = false,
  onSubmit,
  onCancelEdit,
}: TagFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: getTagFormDefaultValues(tag),
  })

  useEffect(() => {
    reset(getTagFormDefaultValues(tag))
  }, [tag, reset])

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>
          {mode === "create" ? "新建标签" : `编辑标签 · ${tag?.name ?? ""}`}
        </CardTitle>
        <CardDescription className={styles.cardDescription}>
          标签更适合细粒度索引，比如 React、部署、阅读清单。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(createTagSubmitPayload(values))
          })}
        >
          <div className={styles.field}>
            <Label htmlFor="tag-name">标签名称</Label>
            <Input id="tag-name" className={styles.input} placeholder="例如：React 19" {...register("name")} />
            {errors.name ? <p className={styles.error}>{errors.name.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="tag-slug">标签链接</Label>
            <Input id="tag-slug" className={styles.input} placeholder="react-19" {...register("slug")} />
            {errors.slug ? <p className={styles.error}>{errors.slug.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="tag-description">标签描述</Label>
            <Textarea
              id="tag-description"
              className={styles.textarea}
              placeholder="补充这个标签会覆盖哪些内容"
              {...register("description")}
            />
            {errors.description ? <p className={styles.error}>{errors.description.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="tag-color">标签颜色</Label>
            <Input id="tag-color" className={styles.input} placeholder="#2563eb" {...register("color")} />
            <p className={styles.helperText}>可选，推荐使用十六进制色值，便于后续前台高亮。</p>
            {errors.color ? <p className={styles.error}>{errors.color.message}</p> : null}
          </div>

          <div className={styles.actions}>
            {mode === "edit" ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                取消编辑
              </Button>
            ) : null}
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : mode === "create" ? "创建标签" : "保存修改"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
