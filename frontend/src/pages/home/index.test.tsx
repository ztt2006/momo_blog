import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import HomePage from "@/pages/home"
import { useSiteStore } from "@/stores/siteStore"

const getPublicArticlesMock = vi.fn()

vi.mock("@/features/article/api", () => ({
  getPublicArticles: (...args: unknown[]) => getPublicArticlesMock(...args),
}))

describe("HomePage", () => {
  beforeEach(() => {
    getPublicArticlesMock.mockReset()
    useSiteStore.setState({
      siteSetting: {
        id: 1,
        siteName: "Momo Research Notes",
        siteSubtitle: "写给未来的自己，也分享给认真阅读的人。",
        siteDescription: "围绕 React、FastAPI 和长期写作整理出来的个人研究笔记。",
        siteKeywords: "React,FastAPI,个人博客",
        logo: null,
        favicon: null,
        githubUrl: null,
        aboutMarkdown: "## 关于",
        icp: null,
        publicEmail: null,
      },
      isLoading: false,
      hasLoaded: true,
      error: null,
    })
  })

  it("renders featured and latest published articles", async () => {
    getPublicArticlesMock.mockResolvedValue({
      total: 2,
      items: [
        {
          id: 1,
          title: "写给自己的 React 19 笔记",
          slug: "react-19-notes",
          summary: "整理升级过程里真正踩过的坑。",
          publishedAt: "2026-04-14T12:00:00Z",
          readingTime: 6,
          wordCount: 1280,
          coverImageId: null,
          coverImageUrl: "http://127.0.0.1:8000/uploads/react-cover.png",
        },
        {
          id: 2,
          title: "FastAPI 博客后端记录",
          slug: "fastapi-blog-backend",
          summary: "把认证、文章和公开接口一点点补全。",
          publishedAt: "2026-04-13T08:00:00Z",
          readingTime: 4,
          wordCount: 860,
          coverImageId: null,
          coverImageUrl: null,
        },
      ],
    })

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole("heading", { name: "Momo Research Notes" })).toBeInTheDocument()
    expect(
      screen.getByText("围绕 React、FastAPI 和长期写作整理出来的个人研究笔记。")
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("写给自己的 React 19 笔记")).toBeInTheDocument()
    })

    expect(screen.getByText("最新文章")).toBeInTheDocument()
    expect(screen.getByText("FastAPI 博客后端记录")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "写给自己的 React 19 笔记" })).toBeInTheDocument()
  })
})
