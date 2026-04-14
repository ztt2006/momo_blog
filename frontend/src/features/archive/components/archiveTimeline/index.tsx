import ArchiveYearGroupBlock from "@/features/archive/components/archiveYearGroup"
import type { ArchiveYearGroup } from "@/features/archive/types"
import styles from "@/features/archive/components/archiveTimeline/index.module.css"

export default function ArchiveTimeline({ groups }: { groups: ArchiveYearGroup[] }) {
  return (
    <div className={styles.timeline}>
      {groups.map((group) => (
        <ArchiveYearGroupBlock key={group.year} group={group} />
      ))}
    </div>
  )
}
