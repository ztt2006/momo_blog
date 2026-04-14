import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import DashboardPage from "@/pages/dashboard"

const getDashboardOverviewMock = vi.fn()

vi.mock("@/features/dashboard/api", () => ({
  getDashboardOverview: (...args: unknown[]) => getDashboardOverviewMock(...args),
}))

describe("DashboardPage", () => {
  beforeEach(() => {
    getDashboardOverviewMock.mockReset()
  })

  it("renders metrics, recent articles and quick actions", async () => {
    getDashboardOverviewMock.mockResolvedValue({
      stats: {
        totalArticles: 12,
        publishedArticles: 8,
        draftArticles: 4,
        topArticles: 2,
        categoryCount: 5,
        tagCount: 14,
        pendingComments: 3,
      },
      publishRate: 67,
      uncategorizedCount: 3,
      latestUpdatedArticles: [
        {
          id: 1,
          title: "React 19 实战记录",
          slug: "react-19-practice",
          summary: "记录升级和落地细节。",
          contentMd: "# test",
          status: "published",
          categoryId: 2,
          coverImageId: null,
          authorId: 1,
          seoTitle: null,
          seoDescription: null,
          seoKeywords: null,
          isTop: true,
          allowComment: true,
          publishedAt: "2026-04-14T10:00:00Z",
          createdAt: "2026-04-14T09:00:00Z",
          updatedAt: "2026-04-14T10:30:00Z",
          tagIds: [1, 2],
        },
      ],
      recentDrafts: [
        {
          id: 2,
          title: "FastAPI 仪表盘设计",
          slug: "fastapi-dashboard-design",
          summary: "草稿说明",
          contentMd: "# draft",
          status: "draft",
          categoryId: null,
          coverImageId: null,
          authorId: 1,
          seoTitle: null,
          seoDescription: null,
          seoKeywords: null,
          isTop: false,
          allowComment: true,
          publishedAt: null,
          createdAt: "2026-04-13T09:00:00Z",
          updatedAt: "2026-04-14T09:30:00Z",
          tagIds: [],
        },
      ],
      siteSnapshot: {
        siteName: "Momo Notes",
        siteSubtitle: "温暖的个人笔记",
        hasDescription: true,
        hasSeoDefaults: true,
      },
    })

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("12")).toBeInTheDocument()
    })

    expect(screen.getAllByText("已发布").length).toBeGreaterThan(0)
    expect(screen.getByText("待审核评论")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("React 19 实战记录")).toBeInTheDocument()
    expect(screen.getByText("FastAPI 仪表盘设计")).toBeInTheDocument()
    expect(screen.getByText("Momo Notes")).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "写新文章" }).length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "管理站点设置" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "去审核评论" })).toBeInTheDocument()
  })
})
