import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import TagPage from "@/pages/tag"

const getTagsMock = vi.fn()
const createTagMock = vi.fn()
const updateTagMock = vi.fn()
const deleteTagMock = vi.fn()

vi.mock("@/features/tag/api", () => ({
  getTags: (...args: unknown[]) => getTagsMock(...args),
  createTag: (...args: unknown[]) => createTagMock(...args),
  updateTag: (...args: unknown[]) => updateTagMock(...args),
  deleteTag: (...args: unknown[]) => deleteTagMock(...args),
}))

describe("TagPage", () => {
  beforeEach(() => {
    getTagsMock.mockReset()
    createTagMock.mockReset()
    updateTagMock.mockReset()
    deleteTagMock.mockReset()
  })

  it("deletes a tag after confirmation", async () => {
    getTagsMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          name: "FastAPI",
          slug: "fastapi",
          description: "FastAPI notes",
          color: "#2563eb",
        },
      ],
    })

    deleteTagMock.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <TagPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("FastAPI")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: "删除" }))
    await userEvent.click(screen.getByRole("button", { name: "确认删除" }))

    await waitFor(() => {
      expect(deleteTagMock).toHaveBeenCalledWith(1)
    })

    expect(screen.queryByText("FastAPI")).not.toBeInTheDocument()
  })
})
