import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const PAGE_TITLES: Record<string, string> = {
  "/admin/posts": "Posts",
  "/admin/posts/new": "New Post",
  "/admin/images": "Images",
  "/admin/categories": "Categories",
  "/admin/tags": "Tags",
};

function resolveTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/admin\/posts\/[^/]+\/edit$/.test(pathname)) return "Edit Post";
  return "Admin";
}

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const title = resolveTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-light-cream">
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-foreground/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-30 md:hidden">
            <Sidebar onNavClick={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-auto p-6">
          <Suspense
            fallback={
              <div className="flex h-32 items-center justify-center">
                <Spinner className="h-8 w-8 text-forest-green" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
