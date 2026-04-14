import { createBrowserRouter } from "react-router"

import ArticleLayout from "@/components/layouts/articleLayout"
import SiteLayout from "@/components/layouts/siteLayout"
import AboutPage from "@/pages/about"
import ArchivePage from "@/pages/archive"
import ArticleDetailPage from "@/pages/articleDetail"
import CategoryPage from "@/pages/category"
import HomePage from "@/pages/home"
import NotFoundPage from "@/pages/notFound"
import TagPage from "@/pages/tag"

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/archive",
        element: <ArchivePage />,
      },
      {
        path: "/categories",
        element: <CategoryPage />,
      },
      {
        path: "/tags",
        element: <TagPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        element: <ArticleLayout />,
        children: [
          {
            path: "/articles/:slug",
            element: <ArticleDetailPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
