import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ArchivePage from "@/pages/archive"

const getArchiveEntriesMock = vi.fn()

vi.mock("@/features/archive/api", () => ({
  getArchiveEntries: (...args: unknown[]) => getArchiveEntriesMock(...args),
}))

describe("ArchivePage", () => {
  beforeEach(() => {
    getArchiveEntriesMock.mockReset()
  })

  it("groups published articles by year", async () => {
    getArchiveEntriesMock.mockResolvedValue([
      {
        year: "2026",
        entries: [
          {
            id: 1,
            title: "React 19 升级记录",
            slug: "react-19-upgrade",
            summary: "记录一次真实升级里的取舍和踩坑。",
            publishedAt: "2026-04-14T12:00:00Z",
            readingTime: 6,
            wordCount: 1200,
            coverImageId: null,
          },
        ],
      },
      {
        year: "2025",
        entries: [
          {
            id: 2,
            title: "FastAPI 博客后台",
            slug: "fastapi-blog-admin",
            summary: "后端从认证到文章 CRUD 的搭建过程。",
            publishedAt: "2025-12-12T08:00:00Z",
            readingTime: 5,
            wordCount: 980,
            coverImageId: null,
          },
        ],
      },
    ])

    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("2026")).toBeInTheDocument()
    })

    expect(screen.getByText("React 19 升级记录")).toBeInTheDocument()
    expect(screen.getByText("FastAPI 博客后台")).toBeInTheDocument()
  })
})
