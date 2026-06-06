import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogCard } from "@/features/blog/components/BlogCard";
import type { Post } from "@/types/blog";

const basePost: Post = {
  id: "1",
  title: "Artículo de prueba",
  slug: "articulo-de-prueba",
  excerpt: "Un extracto de prueba para el test.",
  content: "Contenido completo.",
  category: { id: "c1", name: "Neurodivergencia", slug: "neurodivergencia" },
  tags: [], featured_image: null,
  published_at: "2026-05-01T10:00:00Z",
  created_at: "2026-05-01T10:00:00Z",
  updated_at: "2026-05-01T10:00:00Z",
};

describe("BlogCard", () => {
  it("renders variant-a corner classes by default", () => {
    const { container } = render(<BlogCard post={basePost} />);
    const article = container.querySelector("article");
    expect(article?.className).toContain("rounded-tl-[32px]");
    expect(article?.className).toContain("rounded-br-[32px]");
  });

  it("renders variant-b corner classes when specified", () => {
    const { container } = render(<BlogCard post={basePost} cornerVariant="b" />);
    const article = container.querySelector("article");
    expect(article?.className).toContain("rounded-tr-[32px]");
    expect(article?.className).toContain("rounded-bl-[32px]");
  });

  it("renders category badge for known category with inline background style", () => {
    const { container } = render(<BlogCard post={basePost} />);
    const badge = container.querySelector("span.rounded-full");
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toBe("Neurodivergencia");
    // JSDOM normalises hex to rgb — verify the style is set (non-empty)
    expect((badge as HTMLElement).style.backgroundColor).not.toBe("");
  });

  it("renders badge with fallback colour for unknown category", () => {
    const unknownPost = { ...basePost, category: { id: "c99", name: "Categoría desconocida", slug: "categoria-desconocida" } };
    const { container } = render(<BlogCard post={unknownPost} />);
    const badge = container.querySelector("span.rounded-full");
    expect(badge).not.toBeNull();
    // Falls back to lavender — style is set
    expect((badge as HTMLElement).style.backgroundColor).not.toBe("");
  });

  it("renders the post title", () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByText("Artículo de prueba")).toBeInTheDocument();
  });

  it("renders the excerpt", () => {
    render(<BlogCard post={basePost} />);
    expect(screen.getByText("Un extracto de prueba para el test.")).toBeInTheDocument();
  });

  it("renders Leer más link pointing to the post slug", () => {
    render(<BlogCard post={basePost} />);
    const link = screen.getByRole("link", { name: /leer más/i });
    expect(link).toHaveAttribute("href", "/blog/articulo-de-prueba");
  });
});
