import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostBanner } from "@/features/blog/components/PostBanner";
import type { Post } from "@/types/blog";

const basePost: Post = {
  id: "1",
  title: "Brumas y sprays con aceites esenciales",
  slug: "brumas-aromaterapia-aceites-esenciales",
  excerpt: "Un extracto.",
  content: Array(200).fill("palabra").join(" "),
  category: { id: "c2", name: "Aromaterapia", slug: "aromaterapia" },
  tags: [], featured_image: { original_url: "/assets/blog-aromaterapia.jpg", thumbnail_url: "/assets/blog-aromaterapia.jpg", alt_text: null, subtitle: null },
  published_at: "2026-06-04T10:00:00Z",
  created_at: "2026-06-04T10:00:00Z",
  updated_at: "2026-06-04T10:00:00Z",
};

describe("PostBanner", () => {
  it("renders the post title as h1", () => {
    render(<PostBanner post={basePost} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Brumas y sprays con aceites esenciales"
    );
  });

  it("renders the category badge", () => {
    render(<PostBanner post={basePost} />);
    expect(screen.getByText("Aromaterapia")).toBeInTheDocument();
  });

  it("renders the reading time estimate", () => {
    render(<PostBanner post={basePost} />);
    expect(screen.getByText(/min de lectura/)).toBeInTheDocument();
  });

  it("renders featured image when provided", () => {
    const { container } = render(<PostBanner post={basePost} />);
    const img = container.querySelector("img[src='/assets/blog-aromaterapia.jpg']");
    expect(img).not.toBeNull();
  });

  it("renders fallback when featured_image is null", () => {
    const noImagePost = { ...basePost, featured_image: null };
    const { container } = render(<PostBanner post={noImagePost} />);
    // No featured image — emblem watermark shown instead
    const emblem = container.querySelector("img[src='/assets/estela_castro_emblema.svg']");
    expect(emblem).not.toBeNull();
  });
});
