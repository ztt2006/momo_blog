import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getSeoSettingsFormDefaultValues,
  seoSettingsFormSchema,
  type SeoSettingsFormValues,
} from "@/features/settings/schemas"
import styles from "@/features/settings/components/seoSettingsForm/index.module.css"
import type { SiteSetting } from "@/features/settings/types"

interface SeoSettingsFormProps {
  setting: SiteSetting
  submitting?: boolean
  onSubmit: (values: SeoSettingsFormValues) => Promise<void> | void
}

export default function SeoSettingsForm({
  setting,
  submitting = false,
  onSubmit,
}: SeoSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(seoSettingsFormSchema),
    defaultValues: getSeoSettingsFormDefaultValues(setting),
  })

  useEffect(() => {
    reset(getSeoSettingsFormDefaultValues(setting))
  }, [reset, setting])

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>SEO 与品牌资源</CardTitle>
        <CardDescription className={styles.cardDescription}>
          用于前台默认 meta 信息，以及后续站点图标、分享卡片等统一资源入口。
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values)
          })}
        >
          <div className={styles.field}>
            <Label htmlFor="site-keywords">默认关键词</Label>
            <Input
              id="site-keywords"
              className={styles.input}
              placeholder="例如：个人博客,React,FastAPI,技术笔记"
              {...register("siteKeywords")}
            />
            {errors.siteKeywords ? <p className={styles.error}>{errors.siteKeywords.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-logo">Logo 地址</Label>
            <Input
              id="site-logo"
              className={styles.input}
              placeholder="/uploads/logo.png 或 https://..."
              {...register("logo")}
            />
            <p className={styles.helperText}>先保留地址字段，后续如果接媒体库可以直接复用。</p>
            {errors.logo ? <p className={styles.error}>{errors.logo.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-favicon">Favicon 地址</Label>
            <Input
              id="site-favicon"
              className={styles.input}
              placeholder="/favicon.ico"
              {...register("favicon")}
            />
            {errors.favicon ? <p className={styles.error}>{errors.favicon.message}</p> : null}
          </div>

          <div className={styles.actions}>
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "保存 SEO 设置"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
