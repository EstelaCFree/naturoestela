import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { PostEditorPage } from "@/pages/admin/PostEditorPage";
import { ToastProvider } from "@/components/ui/Toast";
import { server } from "../../mocks/server";
import type { AdminPost } from "@/types/adminPost";

const mockPost: AdminPost = {
  id: "42",
  title: "My post",
  slug: "my-post",
  excerpt: null,
  content: "<p>Hello world</p>",
  status: "draft",
  published_at: null,
  created_by: "human",
  category: null,
  tags: [],
  featured_image: null,
  body_images: [],
  seo: { title: "SEO title", description: null, keywords: null },
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
};

function renderCreate() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={["/admin/posts/new"]}>
          <Routes>
            <Route path="/admin/posts/new" element={<PostEditorPage />} />
            <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

function renderEdit(id = "42") {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <MemoryRouter initialEntries={[`/admin/posts/${id}/edit`]}>
          <Routes>
            <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

describe("PostEditorPage — create mode", () => {
  it("renders blank form in create mode", () => {
    server.use(
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    renderCreate();
    const titleInput = screen.getByPlaceholderText(/post title/i);
    expect(titleInput).toHaveValue("");
  });

  it("slug auto-generates from title", async () => {
    server.use(
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    renderCreate();
    await userEvent.type(screen.getByPlaceholderText(/post title/i), "Mi primer post");
    await waitFor(() => expect(screen.getByText("mi-primer-post")).toBeInTheDocument());
  });

  it("past-date schedule shows inline validation error", async () => {
    server.use(
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    const { container } = renderCreate();
    const dtInput = container.querySelector("input[type='datetime-local']") as HTMLInputElement;
    const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString().slice(0, 16);
    await userEvent.type(dtInput, pastDate);
    await userEvent.click(screen.getByRole("button", { name: /^schedule$/i }));
    await waitFor(() =>
      expect(screen.getByText(/scheduled date must be in the future/i)).toBeInTheDocument()
    );
  });
});

describe("PostEditorPage — edit mode", () => {
  it("shows spinner while loading", () => {
    server.use(
      http.get("*/api/v1/admin/posts/42", () => new Promise(() => {})),
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    renderEdit();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("populates fields from API response", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/42", () => HttpResponse.json(mockPost)),
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    renderEdit();
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/post title/i)).toHaveValue("My post")
    );
    expect(screen.getByDisplayValue("SEO title")).toBeInTheDocument();
  });

  it("shows 'Post not found' on 404", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/99", () =>
        HttpResponse.json({ error: "Not found" }, { status: 404 })
      ),
      http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] }))
    );
    renderEdit("99");
    await waitFor(() =>
      expect(screen.getByText(/post not found/i)).toBeInTheDocument()
    );
  });
});
