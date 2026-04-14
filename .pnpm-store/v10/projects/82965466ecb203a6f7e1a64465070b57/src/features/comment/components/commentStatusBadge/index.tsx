import { Badge } from "@/components/ui/badge"
import type { CommentStatus } from "@/features/comment/types"

interface CommentStatusBadgeProps {
  status: CommentStatus
}

const STATUS_LABEL: Record<CommentStatus, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已屏蔽",
}

export default function CommentStatusBadge({ status }: CommentStatusBadgeProps) {
  const variant = status === "approved" ? "secondary" : "outline"
  return <Badge variant={variant}>{STATUS_LABEL[status]}</Badge>
}
