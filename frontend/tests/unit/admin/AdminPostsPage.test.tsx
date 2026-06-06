import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { AdminPostsPage } from "@/pages/admin/AdminPostsPage";
import { ToastProvider } from "@/components/ui/Toast";
import { server } from "../../mocks/server";
import type { AdminPostListItem } from "@/types/adminPost";

const mockPost: AdminPostListItem = {
  id: "1",
  title: "Test post",
  slug: "test-post",
  status: "draft",
  published_at: null,
  created_by: "human",
  category: { id: "c1", name: "Health", slug: "health" },
  tags: [],
  featured_image: null,
};

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={["/admin/posts"]}>
          <Routes>
            <Route path="/admin/posts" element={<AdminPostsPage />} />
            <Route path="/admin/posts/:id/edit" element={<div>Editor</div>} />
            <Route path="/admin/posts/new" element={<div>New post</div>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

describe("AdminPostsPage", () => {
  it("shows loading skeleton while fetching", () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () => new Promise(() => {}))
    );
    renderPage();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders posts table after successful load", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ data: [mockPost], meta: { total: 1, page: 1, page_size: 20 } })
      )
    );
    renderPage();
    await waitFor(() => expect(screen.getByText("Test post")).toBeInTheDocument());
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getAllByText("Draft").length).toBeGreaterThan(0);
    expect(screen.getByText("Human")).toBeInTheDocument();
  });

  it("shows empty state when no posts exist", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 20 } })
      )
    );
    renderPage();
    await waitFor(() => expect(screen.getByText(/no posts yet/i)).toBeInTheDocument());
  });

  it("status tab change triggers correct API call with status param", async () => {
    let capturedUrl = "";
    server.use(
      http.get("*/api/v1/admin/posts/", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 20 } });
      })
    );
    renderPage();
    await waitFor(() => expect(screen.getByText(/no posts yet/i)).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Draft" }));
    await waitFor(() => expect(capturedUrl).toContain("status=draft"));
  });

  it("delete confirmation dialog appears and sends DELETE on confirm", async () => {
    let deleteCalled = false;
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ data: [mockPost], meta: { total: 1, page: 1, page_size: 20 } })
      ),
      http.delete("*/api/v1/admin/posts/1", () => {
        deleteCalled = true;
        return new HttpResponse(null, { status: 204 });
      })
    );
    renderPage();
    await waitFor(() => screen.getByText("Test post"));
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(screen.getByText(/permanently deleted/i)).toBeInTheDocument();
    const dialog = screen.getByText(/permanently deleted/i).closest("div")!.parentElement!;
    await userEvent.click(within(dialog).getByRole("button", { name: /delete/i }));
    await waitFor(() => expect(deleteCalled).toBe(true));
  });
});
