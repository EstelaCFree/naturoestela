import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Header } from "@/features/home/components/Header";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("Header — Sobre mí nav link", () => {
  it("renders the Sobre mí link", () => {
    renderHeader();
    const links = screen.getAllByText("Sobre mí");
    expect(links.length).toBeGreaterThan(0);
  });

  it("Sobre mí link points to /sobre-mi route", () => {
    renderHeader();
    const links = screen.getAllByRole("link", { name: /sobre mí/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/sobre-mi");
    });
  });

  it("Inicio link navigates to home route", () => {
    renderHeader();
    const inicioLinks = screen.getAllByRole("link", { name: /inicio/i });
    expect(inicioLinks.length).toBeGreaterThan(0);
    inicioLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/");
    });
  });
});
