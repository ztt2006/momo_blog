import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { afterEach, describe, expect, it } from "vitest"

import SiteHeader from "@/features/site/components/siteHeader"
import { usePublicAuthStore } from "@/stores/publicAuthStore"
import { useSiteStore } from "@/stores/siteStore"

describe("SiteHeader", () => {
  afterEach(() => {
    usePublicAuthStore.getState().clearSession()
  })

  it("removes the admin shortcut and shows public auth actions for guests", () => {
    useSiteStore.getState().setSiteSetting({
      ...useSiteStore.getState().siteSetting,
      siteName: "Momo Notes",
    })

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>
    )

    expect(screen.queryByText("进入后台")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "登录" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "注册" })).toBeInTheDocument()
  })

  it("shows the logged-in user identity and supports logout", async () => {
    usePublicAuthStore.getState().setSession({
      token: "public-token",
      user: {
        id: 3,
        username: "reader01",
        email: "reader01@example.com",
        nickname: "Reader 01",
        avatar: null,
        role: "user",
        isActive: true,
      },
    })

    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>
    )

    expect(screen.getByText("Reader 01")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "退出登录" }))

    expect(usePublicAuthStore.getState().token).toBeNull()
    expect(screen.getByRole("link", { name: "登录" })).toBeInTheDocument()
  })
})
