import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute";
import { Spinner } from "@/components/ui/Spinner";
import { AboutPage } from "@/pages/AboutPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { BlogPage } from "@/pages/BlogPage";
import { HomePage } from "@/pages/HomePage";
import { PostDetailPage } from "@/pages/PostDetailPage";

const AdminPostsPage = lazy(() =>
  import("@/pages/admin/AdminPostsPage").then((m) => ({
    default: m.AdminPostsPage,
  })),
);
const AdminImagesPage = lazy(() =>
  import("@/pages/admin/AdminImagesPage").then((m) => ({
    default: m.AdminImagesPage,
  })),
);
const AdminCategoriesPage = lazy(() =>
  import("@/pages/admin/AdminCategoriesPage").then((m) => ({
    default: m.AdminCategoriesPage,
  })),
);
const AdminTagsPage = lazy(() =>
  import("@/pages/admin/AdminTagsPage").then((m) => ({
    default: m.AdminTagsPage,
  })),
);
const AdminNotFoundPage = lazy(() =>
  import("@/pages/admin/AdminNotFoundPage").then((m) => ({
    default: m.AdminNotFoundPage,
  })),
);
const PostEditorPage = lazy(() =>
  import("@/pages/admin/PostEditorPage").then((m) => ({
    default: m.PostEditorPage,
  })),
);

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

function AdminSuspenseFallback() {
  return (
    <div className="flex h-32 items-center justify-center">
      <Spinner className="h-8 w-8 text-forest-green" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sobre-mi", element: <AboutPage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/blog/:slug", element: <PostDetailPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
      {
        path: "/admin",
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/posts" replace /> },
              {
                path: "posts",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <AdminPostsPage />
                  </Suspense>
                ),
              },
              {
                path: "posts/new",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <PostEditorPage />
                  </Suspense>
                ),
              },
              {
                path: "posts/:id/edit",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <PostEditorPage />
                  </Suspense>
                ),
              },
              {
                path: "images",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <AdminImagesPage />
                  </Suspense>
                ),
              },
              {
                path: "categories",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <AdminCategoriesPage />
                  </Suspense>
                ),
              },
              {
                path: "tags",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <AdminTagsPage />
                  </Suspense>
                ),
              },
              {
                path: "*",
                element: (
                  <Suspense fallback={<AdminSuspenseFallback />}>
                    <AdminNotFoundPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
