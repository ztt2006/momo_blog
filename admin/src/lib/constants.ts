export const AUTH_STORAGE_KEYS = {
  token: "momo_blog_admin_token",
  user: "momo_blog_admin_user",
} as const

export const APP_ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  articles: "/articles",
  articleCreate: "/articles/new",
  comments: "/comments",
  categories: "/categories",
  tags: "/tags",
  media: "/media",
  settings: "/settings",
} as const
