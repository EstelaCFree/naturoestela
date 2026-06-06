import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { RelatedPosts } from "@/features/blog/components/RelatedPosts";
import type { Post } from "@/types/blog";

const currentPost: Post = {
  id: "1",
  title: "Artículo actual",
  slug: "articulo-actual",
  excerpt: "Extracto",
  content: "Contenido",
  category: { id: "c2", name: "Aromaterapia", slug: "aromaterapia" },
  tags: [], featured_image: null,
  published_at: "2026-06-04T10:00:00Z",
  created_at: "2026-06-04T10:00:00Z",
  updated_at: "2026-06-04T10:00:00Z",
};

function makePost(n: number): Post {
  return {
    id: String(n),
    title: `Otro artículo ${n}`,
    slug: `otro-articulo-${n}`,
    excerpt: "Extracto",
    content: "Contenido",
    category: { id: "c2", name: "Aromaterapia", slug: "aromaterapia" },
    tags: [], featured_image: null,
    published_at: `2026-05-0${n}T10:00:00Z`,
    created_at: `2026-05-0${n}T10:00:00Z`,
    updated_at: `2026-05-0${n}T10:00:00Z`,
  };
}

function renderRelated(post = currentPost) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <RelatedPosts post={post} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("RelatedPosts", () => {
  it("excludes the current post from related results", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({
          data: [currentPost, makePost(2), makePost(3)],
          meta: { total: 3, page: 1, page_size: 4 },
        })
      )
    );
    renderRelated();
    await waitFor(() => screen.getAllByRole("article"));
    expect(screen.queryByText("Artículo actual")).not.toBeInTheDocument();
  });

  it("renders up to 3 related cards", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({
          data: [makePost(2), makePost(3), makePost(4), makePost(5)],
          meta: { total: 4, page: 1, page_size: 4 },
        })
      )
    );
    renderRelated();
    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeLessThanOrEqual(3);
      expect(articles.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders nothing when no other posts exist", async () => {
    server.use(
      http.get("*/api/v1/posts/", () =>
        HttpResponse.json({ data: [currentPost], meta: { total: 1, page: 1, page_size: 4 } })
      )
    );
    const { container } = renderRelated();
    await new Promise((r) => setTimeout(r, 100));
    expect(container.querySelector("section")).toBeNull();
  });
});
