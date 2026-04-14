import { Copy, ImageIcon, Search, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import ConfirmDialog from "@/components/shared/confirmDialog"
import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { deleteMediaAsset, getMediaAssets, uploadMediaAsset } from "@/features/media/api"
import MediaGrid from "@/features/media/components/mediaGrid"
import UploadPanel from "@/features/media/components/uploadPanel"
import styles from "@/features/media/components/mediaLibrary/index.module.css"
import type { MediaAsset } from "@/features/media/types"

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`
  }

  const kb = value / 1024
  if (kb < 1024) {
    return `${Math.round(kb)} KB`
  }

  return `${(kb / 1024).toFixed(1)} MB`
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState("")
  const [mediaToDelete, setMediaToDelete] = useState<MediaAsset | null>(null)

  useEffect(() => {
    let cancelled = false

    getMediaAssets()
      .then((response) => {
        if (cancelled) {
          return
        }

        setItems(response.items)
        setSelectedId(response.items[0]?.id ?? null)
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "加载媒体库失败")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return items
    }

    return items.filter((item) =>
      [item.originalName, item.filename, item.mimeType].some((value) =>
        value.toLowerCase().includes(normalizedKeyword)
      )
    )
  }, [items, keyword])

  const selectedMedia =
    filteredItems.find((item) => item.id === selectedId) ??
    items.find((item) => item.id === selectedId) ??
    null

  async function handleUpload(file: File) {
    try {
      setUploading(true)
      const uploaded = await uploadMediaAsset(file)
      setItems((current) => [uploaded, ...current])
      setSelectedId(uploaded.id)
      toast.success("媒体图片已上传")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传媒体失败")
    } finally {
      setUploading(false)
    }
  }

  async function handleCopyUrl() {
    if (!selectedMedia?.fileUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(selectedMedia.fileUrl)
      toast.success("媒体链接已复制")
    } catch {
      toast.error("复制失败，请手动复制链接")
    }
  }

  async function handleDeleteSelectedMedia() {
    if (!mediaToDelete) {
      return
    }

    try {
      setDeleting(true)
      await deleteMediaAsset(mediaToDelete.id)
      setItems((current) => {
        const remaining = current.filter((item) => item.id !== mediaToDelete.id)
        setSelectedId((currentSelectedId) => {
          if (currentSelectedId !== mediaToDelete.id) {
            return currentSelectedId
          }

          return remaining[0]?.id ?? null
        })
        return remaining
      })
      setMediaToDelete(null)
      toast.success("媒体素材已删除")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除媒体素材失败")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Loading text="正在整理媒体库..." />
  }

  return (
    <div className={styles.layout}>
      <section className={styles.metricGrid}>
        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{items.length}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>媒体总数</p>
              <p className={styles.metricHint}>当前已上传到媒体库的素材数量</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.metricCard}>
          <CardContent className={styles.metricContent}>
            <strong className={styles.metricValue}>{filteredItems.length}</strong>
            <div className={styles.metricCopy}>
              <p className={styles.metricLabel}>当前结果</p>
              <p className={styles.metricHint}>按关键词筛选后仍可直接选择和复用</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className={styles.mainGrid}>
        <Card className={styles.panelCard}>
          <CardHeader className={styles.panelHeader}>
            <CardTitle className={styles.panelTitle}>媒体列表</CardTitle>
            <CardDescription className={styles.panelDescription}>
              统一管理文章封面和后续可复用的图片资源。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.panelContent}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <Input
                  className={styles.searchInput}
                  placeholder="搜索文件名、原始名称或类型"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <UploadPanel uploading={uploading} onFileSelect={handleUpload} />
            </div>

            {filteredItems.length ? (
              <MediaGrid
                items={filteredItems}
                selectedId={selectedId}
                onSelect={(mediaAssetId) => setSelectedId(mediaAssetId)}
              />
            ) : (
              <EmptyState
                title="还没有匹配的媒体"
                description={
                  items.length
                    ? "换一个关键词试试，或者继续上传新的图片素材。"
                    : "先上传第一张图片，媒体库就会开始工作。"
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className={styles.panelCard}>
          <CardHeader className={styles.panelHeader}>
            <CardTitle className={styles.panelTitle}>素材详情</CardTitle>
            <CardDescription className={styles.panelDescription}>
              选中任意素材后，可以快速确认尺寸、链接和使用场景。
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.panelContent}>
            {selectedMedia ? (
              <div className={styles.detailPanel}>
                <div className={styles.previewFrame}>
                  {selectedMedia.fileUrl ? (
                    <img
                      className={styles.previewImage}
                      src={selectedMedia.fileUrl}
                      alt={selectedMedia.originalName}
                    />
                  ) : (
                    <div className={styles.previewPlaceholder}>
                      <ImageIcon />
                    </div>
                  )}
                </div>

                <div className={styles.detailHeader}>
                  <strong className={styles.fileName}>{selectedMedia.originalName}</strong>
                  <Badge variant="outline">{selectedMedia.mimeType}</Badge>
                </div>

                <div className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <span>存储文件名</span>
                    <code className={styles.detailCode}>{selectedMedia.filename}</code>
                  </div>
                  <div className={styles.detailRow}>
                    <span>文件大小</span>
                    <span>{formatBytes(selectedMedia.fileSize)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>图片尺寸</span>
                    <span>
                      {selectedMedia.width && selectedMedia.height
                        ? `${selectedMedia.width} × ${selectedMedia.height}`
                        : "未记录"}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>上传时间</span>
                    <span>{formatDateTime(selectedMedia.createdAt)}</span>
                  </div>
                </div>

                {selectedMedia.fileUrl ? (
                  <div className={styles.urlBox}>
                    <p className={styles.urlLabel}>文件链接</p>
                    <code className={styles.urlValue}>{selectedMedia.fileUrl}</code>
                    <div className={styles.detailActions}>
                      <Button type="button" variant="outline" className={styles.copyButton} onClick={handleCopyUrl}>
                        <Copy />
                        复制链接
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className={styles.deleteButton}
                        onClick={() => setMediaToDelete(selectedMedia)}
                      >
                        <Trash2 />
                        删除素材
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="还没有选中素材"
                description="从左侧媒体列表中点选一张图片，这里会展示它的详细信息。"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(mediaToDelete)}
        title="删除这个媒体素材？"
        description={
          mediaToDelete
            ? `素材「${mediaToDelete.originalName}」会从媒体库移除，已作为文章封面的引用也会一并解绑。`
            : ""
        }
        loading={deleting}
        onConfirm={handleDeleteSelectedMedia}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setMediaToDelete(null)
          }
        }}
      />
    </div>
  )
}
