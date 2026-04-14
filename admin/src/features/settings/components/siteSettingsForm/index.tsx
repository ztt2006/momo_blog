import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getSiteBasicsFormDefaultValues,
  siteBasicsFormSchema,
  type SiteBasicsFormValues,
} from "@/features/settings/schemas"
import styles from "@/features/settings/components/siteSettingsForm/index.module.css"
import type { SiteSetting } from "@/features/settings/types"

interface SiteSettingsFormProps {
  setting: SiteSetting
  submitting?: boolean
  onSubmit: (values: SiteBasicsFormValues) => Promise<void> | void
}

export default function SiteSettingsForm({
  setting,
  submitting = false,
  onSubmit,
}: SiteSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteBasicsFormValues>({
    resolver: zodResolver(siteBasicsFormSchema),
    defaultValues: getSiteBasicsFormDefaultValues(setting),
  })

  useEffect(() => {
    reset(getSiteBasicsFormDefaultValues(setting))
  }, [reset, setting])

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>站点信息</CardTitle>
        <CardDescription className={styles.cardDescription}>
          这里决定前台的站点名称、简介、关于页正文和公开联系方式。
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
            <Label htmlFor="site-name">站点名称</Label>
            <Input id="site-name" className={styles.input} placeholder="例如：Momo Notes" {...register("siteName")} />
            {errors.siteName ? <p className={styles.error}>{errors.siteName.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-subtitle">站点副标题</Label>
            <Input
              id="site-subtitle"
              className={styles.input}
              placeholder="一句简短的自我介绍或站点说明"
              {...register("siteSubtitle")}
            />
            {errors.siteSubtitle ? <p className={styles.error}>{errors.siteSubtitle.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-description">站点描述</Label>
            <Textarea
              id="site-description"
              className={styles.textarea}
              placeholder="用于首页和默认 SEO 描述"
              {...register("siteDescription")}
            />
            {errors.siteDescription ? <p className={styles.error}>{errors.siteDescription.message}</p> : null}
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.field}>
              <Label htmlFor="site-github">GitHub 链接</Label>
              <Input
                id="site-github"
                className={styles.input}
                placeholder="https://github.com/your-name"
                {...register("githubUrl")}
              />
              {errors.githubUrl ? <p className={styles.error}>{errors.githubUrl.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="site-email">公开邮箱</Label>
              <Input
                id="site-email"
                className={styles.input}
                placeholder="hello@example.com"
                {...register("publicEmail")}
              />
              {errors.publicEmail ? <p className={styles.error}>{errors.publicEmail.message}</p> : null}
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-icp">备案信息</Label>
            <Input
              id="site-icp"
              className={styles.input}
              placeholder="例如：沪 ICP 备 2026000000 号"
              {...register("icp")}
            />
            {errors.icp ? <p className={styles.error}>{errors.icp.message}</p> : null}
          </div>

          <div className={styles.field}>
            <Label htmlFor="site-about">关于页 Markdown</Label>
            <Textarea
              id="site-about"
              className={styles.markdownTextarea}
              placeholder="这里写前台关于页会展示的 Markdown 内容"
              {...register("aboutMarkdown")}
            />
            <p className={styles.helperText}>支持标题、列表、引用和代码块，前台会直接渲染这段内容。</p>
            {errors.aboutMarkdown ? <p className={styles.error}>{errors.aboutMarkdown.message}</p> : null}
          </div>

          <div className={styles.actions}>
            <Button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "保存站点信息"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
