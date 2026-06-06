import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "@/features/shared/components/PageHero";

const testImage = { webp: "/assets/test.webp", jpg: "/assets/test.jpg" };

describe("PageHero", () => {
  it("renders the provided title as h1", () => {
    render(<PageHero title="Blog" image={testImage} />);
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
  });

  it("renders a picture element with webp source", () => {
    const { container } = render(<PageHero title="Blog" image={testImage} />);
    const source = container.querySelector("source[type='image/webp']") as HTMLSourceElement;
    expect(source).not.toBeNull();
    expect(source.srcset).toBe("/assets/test.webp");
  });

  it("renders the jpg fallback img", () => {
    render(<PageHero title="Blog" image={testImage} />);
    const img = document.querySelector("img[src='/assets/test.jpg']") as HTMLImageElement;
    expect(img).not.toBeNull();
  });

  it("renders the emblem watermark", () => {
    const { container } = render(<PageHero title="Blog" image={testImage} />);
    const emblem = container.querySelector("img[src='/assets/estela_castro_emblema.svg']");
    expect(emblem).not.toBeNull();
  });

  it("renders Sobre mí title for AboutPage regression", () => {
    render(<PageHero title="Sobre mí" image={testImage} />);
    expect(screen.getByRole("heading", { level: 1, name: "Sobre mí" })).toBeInTheDocument();
  });
});
