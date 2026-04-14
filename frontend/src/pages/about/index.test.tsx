import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import AboutPage from "@/pages/about"

const getAboutProfileMock = vi.fn()

vi.mock("@/features/about/api", () => ({
  getAboutProfile: (...args: unknown[]) => getAboutProfileMock(...args),
}))

describe("AboutPage", () => {
  beforeEach(() => {
    getAboutProfileMock.mockReset()
  })

  it("renders author profile and focus list", async () => {
    getAboutProfileMock.mockResolvedValue({
      name: "Momo",
      intro: "把学到的东西认真记下来，也把阶段性的思考留给未来的自己。",
      description:
        "这个博客更像长期维护的个人笔记本，技术是主线，项目复盘和日常观察也会慢慢收进来。",
      skills: ["React 19", "FastAPI", "SQLAlchemy 2.0", "写作整理"],
      now: [
        "继续完善博客前后台",
        "把零散项目经验整理成能复用的文章",
        "建立更稳定的个人输出节奏",
      ],
    })

    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("Momo")).toBeInTheDocument()
    })

    expect(screen.getByText("React 19")).toBeInTheDocument()
    expect(screen.getByText("继续完善博客前后台")).toBeInTheDocument()
  })
})
