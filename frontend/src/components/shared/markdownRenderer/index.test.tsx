import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import MarkdownRenderer from "@/components/shared/markdownRenderer"

describe("MarkdownRenderer", () => {
  it("renders external images from markdown", () => {
    render(
      <MarkdownRenderer
        content="![img](https://cdn.nlark.com/yuque/0/2025/png/demo.png)"
      />
    )

    const image = screen.getByRole("img", { name: "img" })
    expect(image).toHaveAttribute("src", "https://cdn.nlark.com/yuque/0/2025/png/demo.png")
  })

  it("normalizes local upload image urls", () => {
    render(<MarkdownRenderer content="![cover](/uploads/demo.png)" />)

    const image = screen.getByRole("img", { name: "cover" })
    expect(image).toHaveAttribute("src", "http://127.0.0.1:8000/uploads/demo.png")
  })
})
