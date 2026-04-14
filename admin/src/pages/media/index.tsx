import PageHeader from "@/components/shared/pageHeader"
import MediaLibrary from "@/features/media/components/mediaLibrary"
import styles from "@/pages/media/index.module.css"

export default function MediaPage() {
  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Media Library"
        title="媒体库"
        description="集中管理博客里会反复使用的图片素材，上传后可以直接给文章和站点设置复用。"
      />

      <MediaLibrary />
    </section>
  )
}
