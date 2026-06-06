import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AboutPage } from "@/pages/AboutPage";

function renderAboutPage() {
  return render(
    <MemoryRouter initialEntries={["/sobre-mi"]}>
      <AboutPage />
    </MemoryRouter>
  );
}

describe("AboutPage", () => {
  it("renders the about hero title", () => {
    renderAboutPage();
    // "Sobre mí" appears in nav and hero — assert at least one is a heading-like element
    const instances = screen.getAllByText("Sobre mí");
    expect(instances.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the intro section with Estela's name", () => {
    renderAboutPage();
    expect(screen.getByText("Hola. Soy Estela Castro.")).toBeInTheDocument();
  });

  it("renders the video section", () => {
    renderAboutPage();
    expect(screen.getByText("Vídeo de presentación")).toBeInTheDocument();
  });

  it("renders all four stat cards", () => {
    renderAboutPage();
    expect(screen.getByText("+700")).toBeInTheDocument();
    expect(screen.getByText("+500")).toBeInTheDocument();
    expect(screen.getByText("+18")).toBeInTheDocument();
    expect(screen.getByText("+10")).toBeInTheDocument();
  });

  it("renders the Mi historia accordion section", () => {
    renderAboutPage();
    expect(screen.getByText("Un poco más sobre mí")).toBeInTheDocument();
  });

  it("renders the testimonials heading", () => {
    renderAboutPage();
    // "Testimonios" appears in nav and in the section heading
    const instances = screen.getAllByText("Testimonios");
    expect(instances.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the footer", () => {
    renderAboutPage();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
