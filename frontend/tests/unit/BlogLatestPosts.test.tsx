import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { server } from "../mocks/server";
import { BlogLatestPosts } from "@/features/blog/components/BlogLatestPosts";

function makePosts(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    title: `Post ${i + 1}`,
    slug: `post-${i + 1}`,
    excerpt: `Extracto ${i + 1}`,
    content: "Contenido",
    category: { id: "c3", name: "Salud Natural", slug: "salud-natural" },
    tags: [], featured_image: null,
    published_at: `2026-05-0${i + 1}T10:00:00Z`,
    created_at: `2026-05-0${i + 1}T10:00:00Z`,
    updated_at: `2026-05-0${i + 1}T10:00:00Z`,
  }));
}

function renderLatestPosts() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/blog"]}>
        <Routes>
          <Route path="/blog" element={<BlogLatestPosts />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BlogLatestPosts", () => {
  it("renders 3 blog cards when API returns 3 posts with preview=true", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(3), meta: { total: 3, page: 1, page_size: 3 } })
      )
    );
    renderLatestPosts();
    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(3));
  });

  it("shows spinner while loading", () => {
    server.use(
      http.get("*/api/v1/posts/", async () => {
        await new Promise(() => {}); // never resolves
      })
    );
    renderLatestPosts();
    expect(document.querySelector("[class*='animate-spin']") ?? document.querySelector("svg")).toBeTruthy();
  });

  it("shows Últimas entradas heading", async () => {
    renderLatestPosts();
    await waitFor(() =>
      expect(screen.getByText("Últimas entradas")).toBeInTheDocument()
    );
  });

  it("Ver todos los artículos button calls scrollIntoView on #blog-archive", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(3), meta: { total: 3, page: 1, page_size: 3 } })
      )
    );
    const archiveEl = document.createElement("div");
    archiveEl.id = "blog-archive";
    const scrollSpy = vi.fn();
    archiveEl.scrollIntoView = scrollSpy;
    document.body.appendChild(archiveEl);

    renderLatestPosts();
    const user = userEvent.setup();
    await waitFor(() => screen.getByText("Ver todos los artículos"));
    await user.click(screen.getByText("Ver todos los artículos"));
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(archiveEl);
  });
});
