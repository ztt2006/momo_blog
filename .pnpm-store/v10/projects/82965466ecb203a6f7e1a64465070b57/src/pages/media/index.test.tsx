import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"

import MediaPage from "@/pages/media"

const getMediaAssetsMock = vi.fn()
const uploadMediaAssetMock = vi.fn()

vi.mock("@/features/media/api", () => ({
  getMediaAssets: (...args: unknown[]) => getMediaAssetsMock(...args),
  uploadMediaAsset: (...args: unknown[]) => uploadMediaAssetMock(...args),
}))

describe("MediaPage", () => {
  beforeEach(() => {
    getMediaAssetsMock.mockReset()
    uploadMediaAssetMock.mockReset()
  })

  it("renders media assets and uploads a new image", async () => {
    getMediaAssetsMock.mockResolvedValue({
      total: 2,
      items: [
        {
          id: 1,
          filename: "cover-a.png",
          originalName: "React Cover",
          mimeType: "image/png",
          fileSize: 1024,
          storageType: "local",
          fileUrl: "http://127.0.0.1:8000/uploads/cover-a.png",
          width: 1600,
          height: 900,
          uploadedBy: 1,
          createdAt: "2026-04-14T10:00:00Z",
          updatedAt: "2026-04-14T10:00:00Z",
        },
        {
          id: 2,
          filename: "cover-b.png",
          originalName: "FastAPI Cover",
          mimeType: "image/png",
          fileSize: 2048,
          storageType: "local",
          fileUrl: "http://127.0.0.1:8000/uploads/cover-b.png",
          width: 1200,
          height: 800,
          uploadedBy: 1,
          createdAt: "2026-04-13T10:00:00Z",
          updatedAt: "2026-04-13T10:00:00Z",
        },
      ],
    })

    uploadMediaAssetMock.mockResolvedValue({
      id: 3,
      filename: "new-image.png",
      originalName: "New Image",
      mimeType: "image/png",
      fileSize: 3072,
      storageType: "local",
      fileUrl: "http://127.0.0.1:8000/uploads/new-image.png",
      width: 1000,
      height: 600,
      uploadedBy: 1,
      createdAt: "2026-04-15T10:00:00Z",
      updatedAt: "2026-04-15T10:00:00Z",
    })

    render(
      <MemoryRouter>
        <MediaPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText("React Cover").length).toBeGreaterThan(0)
    })

    expect(screen.getByText("FastAPI Cover")).toBeInTheDocument()
    expect(screen.getByText("媒体总数")).toBeInTheDocument()
    expect(screen.getAllByText("React Cover").length).toBeGreaterThan(0)

    const input = screen.getByLabelText("上传媒体文件")
    const file = new File(["hello"], "new-image.png", { type: "image/png" })
    await userEvent.upload(input, file)

    await waitFor(() => {
      expect(uploadMediaAssetMock).toHaveBeenCalled()
    })

    expect(screen.getAllByText("New Image").length).toBeGreaterThan(0)
  })
})
