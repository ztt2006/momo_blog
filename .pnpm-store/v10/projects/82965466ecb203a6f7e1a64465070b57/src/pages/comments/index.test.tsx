import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CommentsPage from "@/pages/comments"

const getCommentsMock = vi.fn()
const updateCommentStatusMock = vi.fn()

vi.mock("@/features/comment/api", () => ({
  getComments: (...args: unknown[]) => getCommentsMock(...args),
  updateCommentStatus: (...args: unknown[]) => updateCommentStatusMock(...args),
}))

describe("CommentsPage", () => {
  beforeEach(() => {
    getCommentsMock.mockReset()
    updateCommentStatusMock.mockReset()
  })

  it("renders comments and updates moderation status", async () => {
    getCommentsMock.mockResolvedValue({
      total: 2,
      items: [
        {
          id: 1,
          authorName: "读者 D",
          content: "这一条需要后台审核演示。",
          createdAt: "2026-04-14T10:00:00Z",
          sourceType: "article",
          status: "pending",
          articleId: 3,
          articleTitle: "Moderation Post",
          articleSlug: "moderation-post",
        },
        {
          id: 2,
          authorName: "访客 E",
          content: "这是关于页的一条留言。",
          createdAt: "2026-04-14T11:00:00Z",
          sourceType: "guestbook",
          status: "rejected",
          articleId: null,
          articleTitle: null,
          articleSlug: null,
        },
      ],
    })

    updateCommentStatusMock.mockResolvedValue({
      id: 1,
      authorName: "读者 D",
      content: "这一条需要后台审核演示。",
      createdAt: "2026-04-14T10:00:00Z",
      sourceType: "article",
      status: "approved",
      articleId: 3,
      articleTitle: "Moderation Post",
      articleSlug: "moderation-post",
    })

    render(
      <MemoryRouter>
        <CommentsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("评论与留言审核")).toBeInTheDocument()
    })

    expect(screen.getByText("Moderation Post")).toBeInTheDocument()
    expect(screen.getByText("这是关于页的一条留言。")).toBeInTheDocument()
    expect(screen.getByText("总互动")).toBeInTheDocument()
    expect(screen.getAllByText("待审核").length).toBeGreaterThan(0)

    await userEvent.click(screen.getByRole("button", { name: "通过" }))

    await waitFor(() => {
      expect(updateCommentStatusMock).toHaveBeenCalledWith(1, "approved")
    })

    expect(screen.getAllByText("已通过").length).toBeGreaterThan(0)
  })
})
