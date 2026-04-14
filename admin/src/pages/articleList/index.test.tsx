import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ArticleListPage from "@/pages/articleList"

const getArticlesMock = vi.fn()
const deleteArticleMock = vi.fn()

vi.mock("@/features/article/api", () => ({
  getArticles: (...args: unknown[]) => getArticlesMock(...args),
  deleteArticle: (...args: unknown[]) => deleteArticleMock(...args),
}))

describe("ArticleListPage", () => {
  beforeEach(() => {
    getArticlesMock.mockReset()
    deleteArticleMock.mockReset()
  })

  it("deletes an article after confirmation", async () => {
    getArticlesMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          title: "Delete Me",
          slug: "delete-me",
          summary: "Temporary article",
          contentMd: "# Delete Me",
          status: "draft",
          categoryId: null,
          coverImageId: null,
          coverImageUrl: null,
          authorId: 1,
          seoTitle: null,
          seoDescription: null,
          seoKeywords: null,
          isTop: false,
          allowComment: true,
          publishedAt: null,
          createdAt: "2026-04-14T10:00:00Z",
          updatedAt: "2026-04-14T10:00:00Z",
          tagIds: [],
        },
      ],
    })

    deleteArticleMock.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <ArticleListPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("Delete Me")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: "文章 Delete Me 的更多操作" }))
    await userEvent.click(screen.getByRole("menuitem", { name: "删除文章" }))
    await userEvent.click(screen.getByRole("button", { name: "确认删除" }))

    await waitFor(() => {
      expect(deleteArticleMock).toHaveBeenCalledWith(1)
    })

    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument()
  })
})
