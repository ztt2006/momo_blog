import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import MarkdownEditor from "@/components/shared/markdownEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import ArticlePreviewPanel from "@/features/article/components/articlePreviewPanel"
import { getCategories } from "@/features/category/api"
import {
  articleFormSchema,
  createArticleSubmitPayload,
  getArticleFormDefaultValues,
  type ArticleFormValues,
} from "@/features/article/schemas"
import styles from "@/features/article/components/articleForm/index.module.css"
import type { Article } from "@/features/article/types"
import { getMediaAssets, uploadMediaAsset } from "@/features/media/api"
import MediaPicker from "@/features/media/components/mediaPicker"
import type { MediaAsset } from "@/features/media/types"
import { getTags } from "@/features/tag/api"
import { classNames } from "@/lib/classNames"
import type { Category } from "@/features/category/types"
import type { Tag } from "@/features/tag/types"

interface ArticleFormProps {
  mode: "create" | "edit"
  article?: Article
  submitting?: boolean
  onSubmit: (payload: ReturnType<typeof createArticleSubmitPayload>) => Promise<void> | void
}

export default function ArticleForm({ mode, article, submitting = false, onSubmit }: ArticleFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [taxonomyLoading, setTaxonomyLoading] = useState(true)
  const [mediaUploading, setMediaUploading] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: getArticleFormDefaultValues(article),
  })

  useEffect(() => {
    reset(getArticleFormDefaultValues(article))
  }, [article, reset])

  useEffect(() => {
    let cancelled = false

    Promise.all([getCategories(), getTags()])
      .then(([categoryResponse, tagResponse]) => {
        if (cancelled) {
          return
        }

        setCategories(categoryResponse.items)
        setTags(tagResponse.items)
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "获取分类和标签失败")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setTaxonomyLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    getMediaAssets()
      .then((response) => {
        if (!cancelled) {
          setMediaAssets(response.items)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "获取媒体列表失败")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const title = watch("title")
  const summary = watch("summary")
  const contentMd = watch("contentMd")
  const coverImageId = watch("coverImageId")
  const tagIds = watch("tagIds") ?? []
  const selectedMedia =
    mediaAssets.find((item) => item.id === coverImageId) ??
    (article?.coverImageId && article.coverImageId === coverImageId && article.coverImageUrl
      ? {
          id: article.coverImageId,
          filename: "",
          originalName: article.title,
          mimeType: "image/*",
          fileSize: 0,
          storageType: "local",
          fileUrl: article.coverImageUrl,
          width: null,
          height: null,
          uploadedBy: null,
          createdAt: "",
          updatedAt: "",
        }
      : null)

  function toggleTag(tagId: number) {
    const nextValue = tagIds.includes(tagId)
      ? tagIds.filter((item) => item !== tagId)
      : [...tagIds, tagId]

    setValue("tagIds", nextValue, { shouldDirty: true, shouldTouch: true })
  }

  async function handleMediaUpload(file: File) {
    try {
      setMediaUploading(true)
      const uploaded = await uploadMediaAsset(file)
      setMediaAssets((current) => [uploaded, ...current])
      setValue("coverImageId", uploaded.id, { shouldDirty: true, shouldTouch: true })
      toast.success("封面图片已上传")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传图片失败")
    } finally {
      setMediaUploading(false)
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(createArticleSubmitPayload(values))
      })}
    >
      <div className={styles.mainColumn}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              {mode === "create" ? "写一篇新文章" : "编辑文章"}
            </CardTitle>
            <CardDescription className={styles.cardDescription}>
              先把标题、链接和正文写好，其他设置可以慢慢补。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="title">文章标题</Label>
              <Input id="title" className={styles.input} placeholder="例如：React 19 实战记录" {...register("title")} />
              {errors.title ? <p className={styles.error}>{errors.title.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="slug">文章链接</Label>
              <Input id="slug" className={styles.input} placeholder="react-19-practice-note" {...register("slug")} />
              {errors.slug ? <p className={styles.error}>{errors.slug.message}</p> : null}
            </div>

            <div className={styles.field}>
              <Label htmlFor="summary">摘要</Label>
              <Textarea
                id="summary"
                className={styles.textarea}
                placeholder="写一小段摘要，列表页会优先展示它"
                {...register("summary")}
              />
              {errors.summary ? <p className={styles.error}>{errors.summary.message}</p> : null}
            </div>

            <MarkdownEditor
              label="Markdown 正文"
              description="支持标题、列表、引用、代码块等常见 Markdown 语法。"
              placeholder="从这里开始写作..."
              error={errors.contentMd?.message}
              {...register("contentMd")}
            />
          </CardContent>
        </Card>
      </div>

      <aside className={styles.sideColumn}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>发布设置</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label>文章状态</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={styles.input}>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="publishedAt">发布时间</Label>
              <Input id="publishedAt" className={styles.input} type="datetime-local" {...register("publishedAt")} />
            </div>

            <Controller
              control={control}
              name="isTop"
              render={({ field }) => (
                <label className={styles.switchRow}>
                  <div className={styles.switchCopy}>
                    <span className={styles.switchTitle}>置顶文章</span>
                    <span className={styles.switchText}>在前台优先展示</span>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />

            <Controller
              control={control}
              name="allowComment"
              render={({ field }) => (
                <label className={styles.switchRow}>
                  <div className={styles.switchCopy}>
                    <span className={styles.switchTitle}>允许评论</span>
                    <span className={styles.switchText}>发布后允许读者互动</span>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>分类与标签</CardTitle>
            <CardDescription className={styles.cardDescription}>
              用分类组织主题，用标签补充文章的关键线索。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label>所属分类</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : "none"}
                    onValueChange={(value) => field.onChange(value === "none" ? null : Number(value))}
                    disabled={taxonomyLoading}
                  >
                    <SelectTrigger className={styles.input}>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">暂不分类</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className={styles.helperText}>
                {taxonomyLoading
                  ? "正在加载分类..."
                  : categories.length
                    ? "分类会决定文章在前台的主要归属。"
                    : "还没有分类，稍后可以去分类管理页补充。"}
              </p>
            </div>

            <div className={styles.field}>
              <Label>文章标签</Label>
              {taxonomyLoading ? (
                <p className={styles.helperText}>正在加载标签...</p>
              ) : tags.length ? (
                <div className={styles.tagGroup}>
                  {tags.map((tag) => {
                    const selected = tagIds.includes(tag.id)

                    return (
                      <button
                        key={tag.id}
                        className={classNames(styles.tagButton, selected ? styles.tagButtonActive : "")}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                      >
                        <span className={styles.tagName}>{tag.name}</span>
                        <span className={styles.tagSlug}>{tag.slug}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className={styles.helperText}>还没有标签，稍后可以去标签管理页创建。</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>封面图片</CardTitle>
            <CardDescription className={styles.cardDescription}>
              上传一张图片作为文章封面，前台首页和详情页会优先展示它。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {selectedMedia?.fileUrl ? (
              <div className={styles.coverPreview}>
                <img className={styles.coverPreviewImage} src={selectedMedia.fileUrl} alt={title || selectedMedia.originalName} />
              </div>
            ) : (
              <div className={styles.coverPlaceholder}>暂未选择封面</div>
            )}

            <MediaPicker
              items={mediaAssets}
              selectedId={coverImageId}
              uploading={mediaUploading}
              onSelect={(mediaAssetId) =>
                setValue("coverImageId", mediaAssetId, { shouldDirty: true, shouldTouch: true })
              }
              onClear={() => setValue("coverImageId", null, { shouldDirty: true, shouldTouch: true })}
              onUpload={handleMediaUpload}
            />
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>SEO 信息</CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="seoTitle">SEO 标题</Label>
              <Input id="seoTitle" className={styles.input} placeholder="可选" {...register("seoTitle")} />
            </div>
            <div className={styles.field}>
              <Label htmlFor="seoDescription">SEO 描述</Label>
              <Textarea id="seoDescription" className={styles.textarea} placeholder="可选" {...register("seoDescription")} />
            </div>
            <div className={styles.field}>
              <Label htmlFor="seoKeywords">SEO 关键词</Label>
              <Input id="seoKeywords" className={styles.input} placeholder="例如：React, FastAPI, PostgreSQL" {...register("seoKeywords")} />
            </div>
          </CardContent>
        </Card>

        <ArticlePreviewPanel title={title} summary={summary} contentMd={contentMd} />

        <div className={styles.actions}>
          <Button className={styles.submitButton} type="submit" disabled={submitting}>
            {submitting ? "保存中..." : mode === "create" ? "创建文章" : "保存修改"}
          </Button>
        </div>
      </aside>
    </form>
  )
}
