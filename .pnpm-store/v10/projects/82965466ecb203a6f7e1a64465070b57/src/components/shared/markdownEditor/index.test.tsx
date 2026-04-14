import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import MarkdownEditor from "@/components/shared/markdownEditor"

function TestHarness({
  onImagePaste,
}: {
  onImagePaste: (file: File) => Promise<string>
}) {
  const [value, setValue] = useState("before\nafter")

  return (
    <MarkdownEditor
      label="Markdown 正文"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onImagePaste={onImagePaste}
    />
  )
}

describe("MarkdownEditor", () => {
  it("uploads pasted image files and inserts markdown at cursor", async () => {
    const onImagePaste = vi.fn().mockResolvedValue("![image](/uploads/pasted-image.png)")

    render(<TestHarness onImagePaste={onImagePaste} />)

    const textarea = screen.getByLabelText("Markdown 正文") as HTMLTextAreaElement
    textarea.focus()
    textarea.setSelectionRange(7, 7)

    const file = new File(["hello"], "pasted-image.png", { type: "image/png" })
    fireEvent.paste(textarea, {
      clipboardData: {
        items: [
          {
            kind: "file",
            type: "image/png",
            getAsFile: () => file,
          },
        ],
      },
    })

    await waitFor(() => {
      expect(onImagePaste).toHaveBeenCalledWith(file)
    })

    await waitFor(() => {
      expect(textarea.value).toContain("before\n![image](/uploads/pasted-image.png)\nafter")
    })
  })
})
