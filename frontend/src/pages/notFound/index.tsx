import EmptyState from "@/components/shared/emptyState"

export default function NotFoundPage() {
  return (
    <EmptyState
      title="这页笔记不存在"
      description="也许是地址写错了，也许这部分内容还没有整理好。先回首页继续读别的吧。"
    />
  )
}
