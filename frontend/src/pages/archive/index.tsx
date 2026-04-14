import { useEffect, useState } from "react"

import EmptyState from "@/components/shared/emptyState"
import Loading from "@/components/shared/loading"
import SectionTitle from "@/components/shared/sectionTitle"
import { getArchiveEntries } from "@/features/archive/api"
import ArchiveTimeline from "@/features/archive/components/archiveTimeline"
import type { ArchiveYearGroup } from "@/features/archive/types"
import styles from "@/pages/archive/index.module.css"

export default function ArchivePage() {
  const [groups, setGroups] = useState<ArchiveYearGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArchiveEntries()
      .then((response) => {
        setGroups(response)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section className={styles.page}>
      <SectionTitle
        eyebrow="Archive"
        title="归档"
        description="把写过的内容按年份放回时间里，方便检索，也方便看见思考是怎样一点点累积起来的。"
      />

      {loading ? <Loading text="正在整理归档..." /> : null}

      {!loading && !groups.length ? (
        <EmptyState
          title="归档里还没有内容"
          description="先去后台发布几篇文章吧。这里会慢慢变成一条清晰的写作时间线。"
        />
      ) : null}

      {!loading && groups.length ? <ArchiveTimeline groups={groups} /> : null}
    </section>
  )
}
