import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import TagPage from "@/pages/tag"

const getPublicTagsMock = vi.fn()

vi.mock("@/features/tag/api", () => ({
  getPublicTags: (...args: unknown[]) => getPublicTagsMock(...args),
}))

describe("TagPage", () => {
  beforeEach(() => {
    getPublicTagsMock.mockReset()
  })

  it("renders public tags and related published articles", async () => {
    getPublicTagsMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          name: "React",
          slug: "react",
          description: "React 相关记录",
          color: "#2563eb",
          articleCount: 1,
          articles: [
            {
              id: 12,
              title: "useEffectEvent 使用笔记",
              slug: "use-effect-event-notes",
              summary: "记录 React 19 中新的事件模式。",
              publishedAt: "2026-04-14T13:00:00Z",
              readingTime: 4,
              wordCount: 800,
              coverImageId: null,
            },
          ],
        },
      ],
    })

    render(
      <MemoryRouter>
        <TagPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByRole("link", { name: "React" })).toHaveLength(2)
    })

    expect(screen.getByText("按标签检索")).toBeInTheDocument()
    expect(screen.getByText("useEffectEvent 使用笔记")).toBeInTheDocument()
  })
})
