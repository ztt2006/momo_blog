import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useAuthStore } from "@/stores/authStore"
import LoginForm from "@/features/auth/components/loginForm"

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

describe("LoginForm", () => {
  beforeEach(() => {
    navigateMock.mockReset()
    loginMock.mockReset()
    useAuthStore.getState().clearSession()
  })

  it("submits credentials and stores the session", async () => {
    loginMock.mockResolvedValue({
      accessToken: "token-123",
      tokenType: "bearer",
      user: {
        id: 1,
        username: "momo",
        email: "momo@example.com",
        nickname: "Momo",
        avatar: null,
        role: "admin",
        isActive: true,
      },
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText("用户名"), "momo")
    await userEvent.type(screen.getByLabelText("密码"), "secret123")
    await userEvent.click(screen.getByRole("button", { name: "进入后台" }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: "momo",
        password: "secret123",
      })
    })

    expect(useAuthStore.getState().token).toBe("token-123")
    expect(navigateMock).toHaveBeenCalledWith("/articles", { replace: true })
  })

  it("rejects frontend users from entering admin", async () => {
    loginMock.mockResolvedValue({
      accessToken: "token-user",
      tokenType: "bearer",
      user: {
        id: 2,
        username: "reader",
        email: "reader@example.com",
        nickname: "Reader",
        avatar: null,
        role: "user",
        isActive: true,
      },
    })

    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText("用户名"), "reader")
    await userEvent.type(screen.getByLabelText("密码"), "reader123")
    await userEvent.click(screen.getByRole("button", { name: "进入后台" }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: "reader",
        password: "reader123",
      })
    })

    expect(useAuthStore.getState().token).toBeNull()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
