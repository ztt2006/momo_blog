import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ArticleDetailPage from "@/pages/articleDetail"
import { useSiteStore } from "@/stores/siteStore"

const getPublicArticleDetailMock = vi.fn()
const getArticleCommentsMock = vi.fn()
const createArticleCommentMock = vi.fn()

vi.mock("@/features/article/api", () => ({
  getPublicArticleDetail: (...args: unknown[]) => getPublicArticleDetailMock(...args),
}))

vi.mock("@/features/comment/api", () => ({
  getArticleComments: (...args: unknown[]) => getArticleCommentsMock(...args),
  createArticleComment: (...args: unknown[]) => createArticleCommentMock(...args),
}))

describe("ArticleDetailPage", () => {
  beforeEach(() => {
    getPublicArticleDetailMock.mockReset()
    getArticleCommentsMock.mockReset()
    createArticleCommentMock.mockReset()
    useSiteStore.setState({
      siteSetting: {
        id: 1,
        siteName: "Momo Notes",
        siteSubtitle: "写给未来的自己",
        siteDescription: "记录技术实现、项目复盘和长期思考。",
        siteKeywords: "React,FastAPI",
        logo: null,
        favicon: null,
        githubUrl: null,
        aboutMarkdown: "## About",
        icp: null,
        publicEmail: null,
      },
      isLoading: false,
      hasLoaded: true,
      error: null,
    })
  })

  it("loads the article by slug, renders comments and submits a new one for moderation", async () => {
    getPublicArticleDetailMock.mockResolvedValue({
      id: 1,
      title: "写作系统整理",
      slug: "writing-system-notes",
      summary: "记录个人博客从后台到前台的搭建过程。",
      publishedAt: "2026-04-14T10:00:00Z",
      readingTime: 5,
      wordCount: 920,
      coverImageId: null,
      coverImageUrl: "http://127.0.0.1:8000/uploads/writing-cover.png",
      contentMd: "# 第一段\n\n这是正文内容。",
      category: {
        id: 2,
        name: "工程实践",
        slug: "engineering-practice",
      },
      tags: [
        {
          id: 3,
          name: "React",
          slug: "react",
          color: "#2563eb",
        },
      ],
      toc: [
        { id: "写作系统整理", text: "写作系统整理", level: 1 },
        { id: "第一段", text: "第一段", level: 1 },
      ],
      previousArticle: {
        id: 8,
        title: "前一篇文章",
        slug: "previous-post",
        summary: "上一篇摘要",
        publishedAt: "2026-04-13T10:00:00Z",
        readingTime: 4,
        wordCount: 720,
        coverImageId: null,
        coverImageUrl: null,
      },
      nextArticle: {
        id: 9,
        title: "后一篇文章",
        slug: "next-post",
        summary: "下一篇摘要",
        publishedAt: "2026-04-15T10:00:00Z",
        readingTime: 6,
        wordCount: 1010,
        coverImageId: null,
        coverImageUrl: null,
      },
      relatedArticles: [
        {
          id: 10,
          title: "相关文章",
          slug: "related-post",
          summary: "相关文章摘要",
          publishedAt: "2026-04-12T10:00:00Z",
          readingTime: 3,
          wordCount: 600,
          coverImageId: null,
          coverImageUrl: null,
        },
      ],
      allowComment: true,
    })

    getArticleCommentsMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          authorName: "读者甲",
          authorEmail: "reader@example.com",
          content: "受益很多，感谢分享。",
          createdAt: "2026-04-14T12:00:00Z",
          sourceType: "article",
          articleSlug: "writing-system-notes",
        },
      ],
    })

    createArticleCommentMock.mockResolvedValue({
      id: 2,
      authorName: "新读者",
      authorEmail: "new@example.com",
      content: "准备照着这套流程继续搭博客。",
      createdAt: "2026-04-15T12:00:00Z",
      sourceType: "article",
      articleSlug: "writing-system-notes",
    })

    render(
      <MemoryRouter initialEntries={["/articles/writing-system-notes"]}>
        <Routes>
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(getPublicArticleDetailMock).toHaveBeenCalledWith("writing-system-notes")
    })

    await waitFor(() => {
      expect(getArticleCommentsMock).toHaveBeenCalledWith("writing-system-notes")
    })

    expect(screen.getByRole("heading", { name: "写作系统整理" })).toBeInTheDocument()
    expect(screen.getByText("这是正文内容。")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "写作系统整理" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "工程实践" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "React" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "第一段" })).toBeInTheDocument()
    expect(screen.getByText("前一篇文章")).toBeInTheDocument()
    expect(screen.getByText("后一篇文章")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "相关文章" })).toBeInTheDocument()
    expect(screen.getByText("受益很多，感谢分享。")).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText("你的名字"), "新读者")
    await userEvent.type(screen.getByLabelText("电子邮箱"), "new@example.com")
    await userEvent.type(screen.getByLabelText("评论内容"), "准备照着这套流程继续搭博客。")
    await userEvent.click(screen.getByRole("button", { name: "提交评论" }))

    await waitFor(() => {
      expect(createArticleCommentMock).toHaveBeenCalledWith("writing-system-notes", {
        authorName: "新读者",
        authorEmail: "new@example.com",
        content: "准备照着这套流程继续搭博客。",
      })
    })

    expect(screen.getByText("评论已经收下了，审核通过后会显示在这里。")).toBeInTheDocument()
    expect(screen.queryByText("准备照着这套流程继续搭博客。")).not.toBeInTheDocument()
  })
})
