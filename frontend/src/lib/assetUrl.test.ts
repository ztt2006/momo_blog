import { describe, expect, it } from "vitest"

import { resolveAssetUrl } from "@/lib/assetUrl"

describe("resolveAssetUrl", () => {
  it("keeps external urls intact", () => {
    expect(resolveAssetUrl("https://cdn.nlark.com/yuque/demo.png")).toBe(
      "https://cdn.nlark.com/yuque/demo.png"
    )
  })

  it("normalizes local upload paths", () => {
    expect(resolveAssetUrl("/uploads/demo.png")).toBe(
      "http://127.0.0.1:8000/uploads/demo.png"
    )
  })

  it("removes whitespace from asset values", () => {
    expect(resolveAssetUrl("  /uploads/demo.png \n")).toBe(
      "http://127.0.0.1:8000/uploads/demo.png"
    )
  })
})
