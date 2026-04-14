import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CategoryPage from "@/pages/category"

const getPublicCategoriesMock = vi.fn()

vi.mock("@/features/category/api", () => ({
  getPublicCategories: (...args: unknown[]) => getPublicCategoriesMock(...args),
}))

describe("CategoryPage", () => {
  beforeEach(() => {
    getPublicCategoriesMock.mockReset()
  })

  it("renders public categories and their published articles", async () => {
    getPublicCategoriesMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          name: "前端工程",
          slug: "frontend-engineering",
          description: "关于 React 和工程化的长期笔记",
          sortOrder: 1,
          articleCount: 1,
          articles: [
            {
              id: 11,
              title: "React 19 升级记录",
              slug: "react-19-upgrade-notes",
              summary: "整理升级过程中的兼容性细节。",
              publishedAt: "2026-04-14T12:00:00Z",
              readingTime: 6,
              wordCount: 1200,
              coverImageId: null,
            },
          ],
        },
      ],
    })

    render(
      <MemoryRouter>
        <CategoryPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "前端工程" })).toBeInTheDocument()
    })

    expect(screen.getByText("按分类浏览")).toBeInTheDocument()
    expect(screen.getByText("React 19 升级记录")).toBeInTheDocument()
  })
})
