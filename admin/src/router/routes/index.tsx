import { Navigate, createBrowserRouter } from "react-router"

import AdminLayout from "@/components/layouts/adminLayout"
import AuthLayout from "@/components/layouts/authLayout"
import ArticleCreatePage from "@/pages/articleCreate"
import ArticleEditPage from "@/pages/articleEdit"
import ArticleListPage from "@/pages/articleList"
import CategoryPage from "@/pages/category"
import CommentsPage from "@/pages/comments"
import DashboardPage from "@/pages/dashboard"
import LoginPage from "@/pages/login"
import MediaPage from "@/pages/media"
import NotFoundPage from "@/pages/notFound"
import SettingsPage from "@/pages/settings"
import TagPage from "@/pages/tag"
import { AuthGuard, GuestGuard } from "@/router/guards"
import { APP_ROUTES } from "@/lib/constants"

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: APP_ROUTES.login,
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={APP_ROUTES.articles} replace />,
          },
          {
            path: APP_ROUTES.dashboard,
            element: <DashboardPage />,
          },
          {
            path: APP_ROUTES.articles,
            element: <ArticleListPage />,
          },
          {
            path: APP_ROUTES.comments,
            element: <CommentsPage />,
          },
          {
            path: APP_ROUTES.categories,
            element: <CategoryPage />,
          },
          {
            path: APP_ROUTES.tags,
            element: <TagPage />,
          },
          {
            path: APP_ROUTES.media,
            element: <MediaPage />,
          },
          {
            path: APP_ROUTES.settings,
            element: <SettingsPage />,
          },
          {
            path: APP_ROUTES.articleCreate,
            element: <ArticleCreatePage />,
          },
          {
            path: `${APP_ROUTES.articles}/:articleId/edit`,
            element: <ArticleEditPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])
