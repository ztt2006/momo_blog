import { z } from "zod"

import type { Article, ArticleSubmitPayload } from "@/features/article/types"

export const articleFormSchema = z.object({
  title: z.string().trim().min(1, "请输入文章标题"),
  slug: z
    .string()
    .trim()
    .min(1, "请输入文章链接")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 仅支持小写字母、数字和中横线"),
  summary: z.string().max(300, "摘要不超过 300 字").optional(),
  contentMd: z.string().trim().min(1, "请输入正文内容"),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
  seoTitle: z.string().max(255, "SEO 标题过长").optional(),
  seoDescription: z.string().max(255, "SEO 描述过长").optional(),
  seoKeywords: z.string().max(255, "SEO 关键词过长").optional(),
  categoryId: z.number().int().nullable(),
  coverImageId: z.number().int().nullable(),
  tagIds: z.array(z.number().int()),
  isTop: z.boolean(),
  allowComment: z.boolean(),
})

export type ArticleFormValues = z.infer<typeof articleFormSchema>

function emptyToNull(value?: string): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function getArticleFormDefaultValues(article?: Article): ArticleFormValues {
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    summary: article?.summary ?? "",
    contentMd: article?.contentMd ?? "",
    status: article?.status ?? "draft",
    publishedAt: article?.publishedAt ? article.publishedAt.slice(0, 16) : "",
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
    seoKeywords: article?.seoKeywords ?? "",
    categoryId: article?.categoryId ?? null,
    coverImageId: article?.coverImageId ?? null,
    tagIds: article?.tagIds ?? [],
    isTop: article?.isTop ?? false,
    allowComment: article?.allowComment ?? true,
  }
}

export function createArticleSubmitPayload(values: ArticleFormValues): ArticleSubmitPayload {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    summary: emptyToNull(values.summary),
    contentMd: values.contentMd.trim(),
    status: values.status,
    categoryId: values.categoryId,
    coverImageId: values.coverImageId,
    tagIds: values.tagIds,
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    seoKeywords: emptyToNull(values.seoKeywords),
    isTop: values.isTop,
    allowComment: values.allowComment,
    publishedAt: values.publishedAt?.trim() ? new Date(values.publishedAt).toISOString() : null,
  }
}
