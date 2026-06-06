import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PostSidebar } from "@/features/blog/components/PostSidebar";
import { FILTER_CATEGORIES, CATEGORY_CONFIG } from "@/features/blog/data/categories";

function renderSidebar() {
  return render(
    <MemoryRouter>
      <PostSidebar />
    </MemoryRouter>
  );
}

describe("PostSidebar", () => {
  it("renders all five category links", () => {
    renderSidebar();
    for (const slug of FILTER_CATEGORIES) {
      expect(screen.getByText(CATEGORY_CONFIG[slug].label)).toBeInTheDocument();
    }
  });

  it("category links point to /blog?category=<slug>", () => {
    renderSidebar();
    const aromaterapiaLink = screen.getByText("Aromaterapia").closest("a");
    expect(aromaterapiaLink).toHaveAttribute("href", "/blog?category=aromaterapia");
  });

  it("renders Escríbeme link pointing to /#contacto", () => {
    renderSidebar();
    const link = screen.getByText("Escríbeme →");
    expect(link).toHaveAttribute("href", "/#contacto");
  });

  it("renders Pedir cita link pointing to /#contacto", () => {
    renderSidebar();
    const link = screen.getByText("Pedir cita");
    expect(link).toHaveAttribute("href", "/#contacto");
  });

  it("clicking the heart button shows ¡Gracias!", async () => {
    renderSidebar();
    const user = userEvent.setup();
    const heartButton = screen.getByRole("button", { name: /me gusta/i });
    await user.click(heartButton);
    expect(screen.getByText("¡Gracias!")).toBeInTheDocument();
  });
});
