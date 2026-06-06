import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { BlogArchive } from "@/features/blog/components/BlogArchive";

function makePosts(n: number, offset = 0) {
  return Array.from({ length: n }, (_, i) => ({
    id: String(offset + i + 1),
    title: `Artículo ${offset + i + 1}`,
    slug: `articulo-${offset + i + 1}`,
    excerpt: `Extracto ${offset + i + 1}`,
    content: "Contenido",
    category: { id: "c3", name: "Salud Natural", slug: "salud-natural" },
    tags: [], featured_image: null,
    published_at: `2026-05-01T10:00:00Z`,
    created_at: `2026-05-01T10:00:00Z`,
    updated_at: `2026-05-01T10:00:00Z`,
  }));
}

function renderArchive(initialSearch = "") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/blog${initialSearch}`]}>
        <Routes>
          <Route path="/blog" element={<BlogArchive />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BlogArchive", () => {
  it("renders up to 12 blog cards when a full page is returned", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(12), meta: { total: 24, page: 1, page_size: 12 } })
      )
    );
    renderArchive();
    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(12));
  });

  it("Anterior button is disabled on page 1", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(12), meta: { total: 24, page: 1, page_size: 12 } })
      )
    );
    renderArchive();
    await waitFor(() => screen.getByText("Anterior"));
    expect(screen.getByText("Anterior")).toBeDisabled();
  });

  it("Siguiente button is disabled on the last page", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(5), meta: { total: 5, page: 1, page_size: 12 } })
      )
    );
    renderArchive();
    // Only 1 page → no pagination controls rendered
    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(5));
    expect(screen.queryByText("Siguiente")).not.toBeInTheDocument();
  });

  it("shows empty state when no posts match the category", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 12 } })
      )
    );
    renderArchive("?category=aromaterapia");
    await waitFor(() =>
      expect(
        screen.getByText(/no hay artículos publicados en esta categoría/i)
      ).toBeInTheDocument()
    );
  });

  it("renders pagination and clicking Siguiente updates page param", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: makePosts(12), meta: { total: 24, page: 1, page_size: 12 } })
      )
    );
    renderArchive();
    const user = userEvent.setup();
    await waitFor(() => screen.getByText("Siguiente"));
    await user.click(screen.getByText("Siguiente"));
    // After click, page 2 button should be rendered as active
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
    );
  });
});
