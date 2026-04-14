import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import LoginPage from "@/pages/login"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

const navigateMock = vi.fn()
const loginMock = vi.fn()

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock("@/features/auth/api", () => ({
  login: (...args: unknown[]) => loginMock(...args),
}))

describe("PublicLoginPage", () => {
  beforeEach(() => {
    navigateMock.mockReset()
    loginMock.mockReset()
    usePublicAuthStore.getState().clearSession()
  })

  it("logs in a public user and stores the session", async () => {
    loginMock.mockResolvedValue({
      accessToken: "public-token",
      tokenType: "bearer",
      user: {
        id: 3,
        username: "reader01",
        email: "reader01@example.com",
        nickname: "Reader 01",
        avatar: null,
        bio: null,
        role: "user",
        isActive: true,
      },
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText("用户名"), "reader01")
    await userEvent.type(screen.getByLabelText("密码"), "reader123")
    await userEvent.click(screen.getByRole("button", { name: "登录" }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: "reader01",
        password: "reader123",
      })
    })

    expect(usePublicAuthStore.getState().token).toBe("public-token")
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true })
  })
})
