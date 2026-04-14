export function formatPublishDate(value?: string | null): string {
  if (!value) {
    return "未发布"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "未发布"
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
