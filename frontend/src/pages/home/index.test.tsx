import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import HomePage from "@/pages/home"

const getPublicArticlesMock = vi.fn()

vi.mock("@/features/article/api", () => ({
  getPublicArticles: (...args: unknown[]) => getPublicArticlesMock(...args),
}))

describe("HomePage", () => {
  beforeEach(() => {
    getPublicArticlesMock.mockReset()
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
        },
      ],
    })

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("写给自己的 React 19 笔记")).toBeInTheDocument()
    })

    expect(screen.getByText("最新文章")).toBeInTheDocument()
    expect(screen.getByText("FastAPI 博客后端记录")).toBeInTheDocument()
  })
})
