import { describe, expect, it } from "vitest"

import {
  createSiteSettingSubmitPayload,
  getSiteSettingFormDefaultValues,
  siteSettingFormSchema,
} from "@/features/settings/schemas"
import type { SiteSetting } from "@/features/settings/types"

describe("site setting schemas", () => {
  it("rejects empty site name", () => {
    const result = siteSettingFormSchema.safeParse({
      ...getSiteSettingFormDefaultValues(),
      siteName: "",
    })

    expect(result.success).toBe(false)
  })

  it("normalizes optional fields before submit", () => {
    const payload = createSiteSettingSubmitPayload({
      siteName: "  Momo Notes  ",
      siteSubtitle: "  写给未来的自己  ",
      siteDescription: "  慢慢整理输出  ",
      siteKeywords: " React, FastAPI ",
      logo: "   ",
      favicon: "  /favicon.ico  ",
      githubUrl: "  https://github.com/momo/blog  ",
      aboutMarkdown: "  ## About  ",
      icp: "   ",
      publicEmail: "  hello@example.com  ",
    })

    expect(payload).toEqual({
      siteName: "Momo Notes",
      siteSubtitle: "写给未来的自己",
      siteDescription: "慢慢整理输出",
      siteKeywords: "React, FastAPI",
      logo: null,
      favicon: "/favicon.ico",
      githubUrl: "https://github.com/momo/blog",
      aboutMarkdown: "## About",
      icp: null,
      publicEmail: "hello@example.com",
    })
  })

  it("maps backend values to form defaults", () => {
    const setting: SiteSetting = {
      id: 1,
      siteName: "Momo Notes",
      siteSubtitle: null,
      siteDescription: "notes",
      siteKeywords: null,
      logo: null,
      favicon: null,
      githubUrl: null,
      aboutMarkdown: null,
      icp: null,
      publicEmail: "hello@example.com",
    }

    expect(getSiteSettingFormDefaultValues(setting)).toEqual({
      siteName: "Momo Notes",
      siteSubtitle: "",
      siteDescription: "notes",
      siteKeywords: "",
      logo: "",
      favicon: "",
      githubUrl: "",
      aboutMarkdown: "",
      icp: "",
      publicEmail: "hello@example.com",
    })
  })
})
