import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, it } from "vitest"

import AdminLayout from "@/components/layouts/adminLayout"
import { useAuthStore } from "@/stores/authStore"

describe("AdminLayout", () => {
  afterEach(() => {
    useAuthStore.getState().clearSession()
  })

  it("shows user management navigation for superadmin only", () => {
    useAuthStore.getState().setSession({
      token: "super-token",
      user: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        nickname: "Admin",
        avatar: null,
        role: "superadmin",
        isActive: true,
      },
    })

    const { rerender } = render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(screen.getAllByText("用户管理").length).toBeGreaterThan(0)

    useAuthStore.getState().setSession({
      token: "admin-token",
      user: {
        id: 2,
        username: "editor",
        email: "editor@example.com",
        nickname: "Editor",
        avatar: null,
        role: "admin",
        isActive: true,
      },
    })

    rerender(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(screen.queryByText("用户管理")).not.toBeInTheDocument()
  })
})
