import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import AboutPage from "@/pages/about"
import { useSiteStore } from "@/stores/siteStore"

const getGuestbookMessagesMock = vi.fn()
const createGuestbookMessageMock = vi.fn()

vi.mock("@/features/comment/api", () => ({
  getGuestbookMessages: (...args: unknown[]) => getGuestbookMessagesMock(...args),
  createGuestbookMessage: (...args: unknown[]) => createGuestbookMessageMock(...args),
}))

describe("AboutPage", () => {
  beforeEach(() => {
    getGuestbookMessagesMock.mockReset()
    createGuestbookMessageMock.mockReset()
    useSiteStore.setState({
      siteSetting: {
        id: 1,
        siteName: "Momo Notes",
        siteSubtitle: "写给未来的自己",
        siteDescription: "个人博客",
        siteKeywords: "React,FastAPI",
        logo: null,
        favicon: null,
        githubUrl: "https://github.com/momo/blog",
        aboutMarkdown:
          "## 关于这个博客\n\n这里记录长期可回看的技术笔记与项目复盘。\n\n- React 19\n- FastAPI\n- 技术写作",
        icp: null,
        publicEmail: "hello@example.com",
      },
      isLoading: false,
      hasLoaded: true,
      error: null,
    })
  })

  it("renders site about markdown, guestbook messages and submits a message for moderation", async () => {
    getGuestbookMessagesMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 11,
          authorName: "访客 A",
          authorEmail: "guest@example.com",
          content: "风格很舒服，准备常来看看。",
          createdAt: "2026-04-14T09:00:00Z",
          sourceType: "guestbook",
          articleSlug: null,
        },
      ],
    })

    createGuestbookMessageMock.mockResolvedValue({
      id: 12,
      authorName: "访客 B",
      authorEmail: "hello@example.com",
      content: "给未来的自己也留一句加油。",
      createdAt: "2026-04-15T09:00:00Z",
      sourceType: "guestbook",
      articleSlug: null,
    })

    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    )

    expect(screen.getByText("关于这个博客")).toBeInTheDocument()
    expect(screen.getByText("这里记录长期可回看的技术笔记与项目复盘。")).toBeInTheDocument()
    expect(screen.getByText("React 19")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "https://github.com/momo/blog" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "hello@example.com" })).toBeInTheDocument()
    await waitFor(() => {
      expect(getGuestbookMessagesMock).toHaveBeenCalled()
    })
    expect(screen.getByText("风格很舒服，准备常来看看。")).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText("留言昵称"), "访客 B")
    await userEvent.type(screen.getByLabelText("留言邮箱"), "hello@example.com")
    await userEvent.type(screen.getByLabelText("留言内容"), "给未来的自己也留一句加油。")
    await userEvent.click(screen.getByRole("button", { name: "提交留言" }))

    await waitFor(() => {
      expect(createGuestbookMessageMock).toHaveBeenCalledWith({
        authorName: "访客 B",
        authorEmail: "hello@example.com",
        content: "给未来的自己也留一句加油。",
      })
    })

    expect(screen.getByText("留言已经收到，审核通过后会展示在留言板。")).toBeInTheDocument()
    expect(screen.queryByText("给未来的自己也留一句加油。")).not.toBeInTheDocument()
  })
})
