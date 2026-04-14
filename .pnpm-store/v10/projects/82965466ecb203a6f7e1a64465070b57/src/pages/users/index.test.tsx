import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import UsersPage from "@/pages/users"

const getUsersMock = vi.fn()
const createUserMock = vi.fn()
const updateUserMock = vi.fn()
const deleteUserMock = vi.fn()

vi.mock("@/features/user/api", () => ({
  getUsers: (...args: unknown[]) => getUsersMock(...args),
  createUser: (...args: unknown[]) => createUserMock(...args),
  updateUser: (...args: unknown[]) => updateUserMock(...args),
  deleteUser: (...args: unknown[]) => deleteUserMock(...args),
}))

describe("UsersPage", () => {
  beforeEach(() => {
    getUsersMock.mockReset()
    createUserMock.mockReset()
    updateUserMock.mockReset()
    deleteUserMock.mockReset()
  })

  it("renders users and supports create update and delete", async () => {
    getUsersMock.mockResolvedValue({
      total: 2,
      items: [
        {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          nickname: "Admin",
          avatar: null,
          role: "superadmin",
          isActive: true,
        },
        {
          id: 2,
          username: "editor",
          email: "editor@example.com",
          nickname: "Editor",
          avatar: null,
          role: "admin",
          isActive: true,
        },
      ],
    })

    createUserMock.mockResolvedValue({
      id: 3,
      username: "reader01",
      email: "reader01@example.com",
      nickname: "Reader 01",
      avatar: null,
      role: "user",
      isActive: true,
    })

    updateUserMock.mockResolvedValue({
      id: 2,
      username: "editor",
      email: "editor@example.com",
      nickname: "Editor Updated",
      avatar: null,
      role: "user",
      isActive: false,
    })

    deleteUserMock.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("用户管理")).toBeInTheDocument()
    })

    expect(screen.getByText("admin")).toBeInTheDocument()
    expect(screen.getByText("editor")).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText("用户名"), "reader01")
    await userEvent.type(screen.getByLabelText("邮箱"), "reader01@example.com")
    await userEvent.type(screen.getByLabelText("密码"), "reader123")
    await userEvent.type(screen.getByLabelText("昵称"), "Reader 01")
    await userEvent.click(screen.getByRole("button", { name: "创建用户" }))

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalled()
    })

    expect(screen.getByText("reader01")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "编辑 editor" }))
    const nicknameInput = screen.getByLabelText("昵称")
    await userEvent.clear(nicknameInput)
    await userEvent.type(nicknameInput, "Editor Updated")
    await userEvent.click(screen.getByRole("button", { name: "停用用户" }))
    await userEvent.click(screen.getByRole("button", { name: "保存修改" }))

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          nickname: "Editor Updated",
          isActive: false,
        })
      )
    })

    await userEvent.click(screen.getByRole("button", { name: "删除 editor" }))
    await userEvent.click(screen.getByRole("button", { name: "确认删除" }))

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith(2)
    })

    expect(screen.queryByText("editor")).not.toBeInTheDocument()
  })
})
