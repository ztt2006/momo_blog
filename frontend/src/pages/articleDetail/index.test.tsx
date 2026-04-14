import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ArticleDetailPage from "@/pages/articleDetail"

const getPublicArticleDetailMock = vi.fn()

vi.mock("@/features/article/api", () => ({
  getPublicArticleDetail: (...args: unknown[]) => getPublicArticleDetailMock(...args),
}))

describe("ArticleDetailPage", () => {
  beforeEach(() => {
    getPublicArticleDetailMock.mockReset()
  })

  it("loads the article by slug and renders markdown content", async () => {
    getPublicArticleDetailMock.mockResolvedValue({
      id: 1,
      title: "写作系统整理",
      slug: "writing-system-notes",
      summary: "记录个人博客从后台到前台的搭建过程。",
      publishedAt: "2026-04-14T10:00:00Z",
      readingTime: 5,
      wordCount: 920,
      coverImageId: null,
      contentMd: "# 第一段\n\n这是正文内容。",
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

    expect(screen.getByText("写作系统整理")).toBeInTheDocument()
    expect(screen.getByText("这是正文内容。")).toBeInTheDocument()
  })
})
