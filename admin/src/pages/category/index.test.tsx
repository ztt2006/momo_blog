import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CategoryPage from "@/pages/category"

const getCategoriesMock = vi.fn()
const createCategoryMock = vi.fn()
const updateCategoryMock = vi.fn()
const deleteCategoryMock = vi.fn()

vi.mock("@/features/category/api", () => ({
  getCategories: (...args: unknown[]) => getCategoriesMock(...args),
  createCategory: (...args: unknown[]) => createCategoryMock(...args),
  updateCategory: (...args: unknown[]) => updateCategoryMock(...args),
  deleteCategory: (...args: unknown[]) => deleteCategoryMock(...args),
}))

describe("CategoryPage", () => {
  beforeEach(() => {
    getCategoriesMock.mockReset()
    createCategoryMock.mockReset()
    updateCategoryMock.mockReset()
    deleteCategoryMock.mockReset()
  })

  it("deletes a category after confirmation", async () => {
    getCategoriesMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 1,
          name: "React",
          slug: "react",
          description: "React notes",
          sortOrder: 1,
          isVisible: true,
        },
      ],
    })

    deleteCategoryMock.mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <CategoryPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: "删除" }))
    await userEvent.click(screen.getByRole("button", { name: "确认删除" }))

    await waitFor(() => {
      expect(deleteCategoryMock).toHaveBeenCalledWith(1)
    })

    expect(screen.queryByText("React")).not.toBeInTheDocument()
  })
})
