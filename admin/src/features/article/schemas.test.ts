import { describe, expect, it } from "vitest"

import {
  articleFormSchema,
  createArticleSubmitPayload,
  getArticleFormDefaultValues,
} from "@/features/article/schemas"
import type { Article } from "@/features/article/types"

describe("article schemas", () => {
  it("rejects empty title and markdown content", () => {
    const result = articleFormSchema.safeParse({
      ...getArticleFormDefaultValues(),
      title: "",
      contentMd: "",
    })

    expect(result.success).toBe(false)
  })

  it("normalizes optional fields before submit", () => {
    const payload = createArticleSubmitPayload({
      ...getArticleFormDefaultValues(),
      title: "测试文章",
      slug: "test-post",
      contentMd: "# Hello",
      summary: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      publishedAt: "",
      isTop: true,
      allowComment: false,
      status: "draft",
    })

    expect(payload).toEqual({
      title: "测试文章",
      slug: "test-post",
      summary: null,
      contentMd: "# Hello",
      status: "draft",
      categoryId: null,
      coverImageId: null,
      tagIds: [],
      seoTitle: null,
      seoDescription: null,
      seoKeywords: null,
      isTop: true,
      allowComment: false,
      publishedAt: null,
    })
  })

  it("preserves category and tags in defaults and submit payload", () => {
    const article: Article = {
      id: 1,
      title: "分类与标签",
      slug: "category-and-tags",
      summary: "test",
      contentMd: "hello",
      status: "published",
      categoryId: 3,
      coverImageId: null,
      authorId: 2,
      seoTitle: null,
      seoDescription: null,
      seoKeywords: null,
      isTop: false,
      allowComment: true,
      publishedAt: "2026-04-14T08:30:00.000Z",
      createdAt: "2026-04-14T08:30:00.000Z",
      updatedAt: "2026-04-14T08:30:00.000Z",
      tagIds: [4, 6],
    }

    const defaults = getArticleFormDefaultValues(article)

    expect(defaults.categoryId).toBe(3)
    expect(defaults.tagIds).toEqual([4, 6])

    const payload = createArticleSubmitPayload({
      ...defaults,
      title: "分类与标签",
      slug: "category-and-tags",
      contentMd: "hello",
      status: "published",
      categoryId: 5,
      tagIds: [8, 9],
    })

    expect(payload.categoryId).toBe(5)
    expect(payload.tagIds).toEqual([8, 9])
  })

  it("preserves cover image in defaults and submit payload", () => {
    const article: Article = {
      id: 2,
      title: "封面测试",
      slug: "cover-test",
      summary: null,
      contentMd: "hello",
      status: "draft",
      categoryId: null,
      coverImageId: 12,
      authorId: 2,
      seoTitle: null,
      seoDescription: null,
      seoKeywords: null,
      isTop: false,
      allowComment: true,
      publishedAt: null,
      createdAt: "2026-04-14T08:30:00.000Z",
      updatedAt: "2026-04-14T08:30:00.000Z",
      tagIds: [],
    }

    const defaults = getArticleFormDefaultValues(article)
    expect(defaults.coverImageId).toBe(12)

    const payload = createArticleSubmitPayload({
      ...defaults,
      title: "封面测试",
      slug: "cover-test",
      contentMd: "hello",
      status: "draft",
      coverImageId: 22,
    })

    expect(payload.coverImageId).toBe(22)
  })
})
