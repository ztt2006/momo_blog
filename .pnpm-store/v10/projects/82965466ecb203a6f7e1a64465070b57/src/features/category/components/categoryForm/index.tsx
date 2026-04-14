import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  categoryFormSchema,
  createCategorySubmitPayload,
  getCategoryFormDefaultValues,
  type CategoryFormValues,
} from "@/features/category/schemas"
import styles from "@/features/category/components/categoryForm/index.module.css"
import type { Category } from "@/features/category/types"

interface CategoryFormProps {
  mode: "create" | "edit"
  category?: Category
  submitting?: boolean
  onSubmit: (payload: ReturnType<typeof createCategorySubmitPayload>) => Promise<void> | void
  onCancelEdit?: () => void
}

export default function CategoryForm({
  mode,
  category,
  submitting = false,
  onSubmit,
  onCancelEdit,
}: CategoryFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getCategoryFormDefaultValues(category),
  })

  useEffect(() => {
    reset(getCategoryFormDefaultValues(category))
  }, [category, reset])

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>
          {mode === "create" ? "新建分类" : `编辑分类 · ${category?.name ?? ""}`}
        </CardTitle>
        <CardDescription className={styles.cardDescription}>
          分类更适合管理长期主题，比如前端、后端、读书笔记。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(createCategorySubmitPayload(values))
          })}
        >
          <div className={styles.field}>
            <Label htmlFor="category-name">分类名称</Label>
            <Input id="category-name" className={styles.input} placeholder="例如：前端工程" {...register("name")} />
            {errors.name ? <p className={styles.error}>{errors.name.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="category-slug">分类链接</Label>
            <Input id="category-slug" className={styles.input} placeholder="frontend-engineering" {...register("slug")} />
            {errors.slug ? <p className={styles.error}>{errors.slug.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="category-description">分类描述</Label>
            <Textarea
              id="category-description"
              className={styles.textarea}
              placeholder="一句话说明这个分类会收纳什么内容"
              {...register("description")}
            />
            {errors.description ? <p className={styles.error}>{errors.description.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="category-sort">排序值</Label>
            <Input
              id="category-sort"
              className={styles.input}
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
            />
            {errors.sortOrder ? <p className={styles.error}>{errors.sortOrder.message}</p> : null}
          </div>

          <Controller
            control={control}
            name="isVisible"
            render={({ field }) => (
              <label className={styles.switchRow}>
                <div className={styles.switchCopy}>
                  <span className={styles.switchTitle}>前台显示</span>
                  <span className={styles.switchText}>关闭后分类仍保留在后台，但不会在前台展示。</span>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </label>
            )}
          />

          <div className={styles.actions}>
            {mode === "edit" ? (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                取消编辑
              </Button>
            ) : null}
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : mode === "create" ? "创建分类" : "保存修改"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
