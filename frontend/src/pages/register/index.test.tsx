import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import RegisterPage from "@/pages/register"
import { usePublicAuthStore } from "@/stores/publicAuthStore"

const navigateMock = vi.fn()
const registerMock = vi.fn()

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock("@/features/auth/api", () => ({
  register: (...args: unknown[]) => registerMock(...args),
}))

describe("PublicRegisterPage", () => {
  beforeEach(() => {
    navigateMock.mockReset()
    registerMock.mockReset()
    usePublicAuthStore.getState().clearSession()
  })

  it("registers a public user and stores the session", async () => {
    registerMock.mockResolvedValue({
      accessToken: "new-public-token",
      tokenType: "bearer",
      user: {
        id: 4,
        username: "newreader",
        email: "newreader@example.com",
        nickname: "New Reader",
        avatar: null,
        role: "user",
        isActive: true,
      },
    })

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText("用户名"), "newreader")
    await userEvent.type(screen.getByLabelText("邮箱"), "newreader@example.com")
    await userEvent.type(screen.getByLabelText("密码"), "reader123")
    await userEvent.type(screen.getByLabelText("昵称"), "New Reader")
    await userEvent.click(screen.getByRole("button", { name: "注册" }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        username: "newreader",
        email: "newreader@example.com",
        password: "reader123",
        nickname: "New Reader",
      })
    })

    expect(usePublicAuthStore.getState().token).toBe("new-public-token")
    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true })
  })
})
