export const SITE_INFO = {
  title: "Momo Notes",
  subtitle: "写给未来的自己，也偶尔分享给路过的人。",
  description:
    "一个慢慢生长的个人博客，记录技术、项目和日常思考，把零散经验整理成可回看的文字。",
} as const

export const PUBLIC_ROUTES = {
  home: "/",
  categories: "/categories",
  tags: "/tags",
  articleDetail: "/articles/:slug",
} as const
