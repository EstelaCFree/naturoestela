import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AboutIntro } from "@/features/about/components/AboutIntro";
import { AboutMore } from "@/features/about/components/AboutMore";
import { AboutStats } from "@/features/about/components/AboutStats";
import { AboutVideo } from "@/features/about/components/AboutVideo";

describe("AboutIntro", () => {
  it("renders subtitle and heading", () => {
    render(<MemoryRouter><AboutIntro /></MemoryRouter>);
    expect(screen.getByText("Naturópata y aromaterapéuta")).toBeInTheDocument();
    expect(screen.getByText("Hola. Soy Estela Castro.")).toBeInTheDocument();
  });

  it("renders all three bio paragraphs", () => {
    render(<MemoryRouter><AboutIntro /></MemoryRouter>);
    expect(screen.getByText(/Llevo 18 años/)).toBeInTheDocument();
    expect(screen.getByText(/integrativa/)).toBeInTheDocument();
    expect(screen.getByText(/camino hacia el equilibrio/)).toBeInTheDocument();
  });
});

describe("AboutVideo", () => {
  it("renders the video placeholder text", () => {
    render(<MemoryRouter><AboutVideo /></MemoryRouter>);
    expect(screen.getByText("Vídeo de presentación")).toBeInTheDocument();
    expect(screen.getByText("¿Quién soy y qué hago?")).toBeInTheDocument();
  });
});

describe("AboutStats", () => {
  it("renders all four stat values", () => {
    render(<MemoryRouter><AboutStats /></MemoryRouter>);
    expect(screen.getByText("+700")).toBeInTheDocument();
    expect(screen.getByText("+500")).toBeInTheDocument();
    expect(screen.getByText("+18")).toBeInTheDocument();
    expect(screen.getByText("+10")).toBeInTheDocument();
  });

  it("renders all four stat labels", () => {
    render(<MemoryRouter><AboutStats /></MemoryRouter>);
    expect(screen.getByText("Alumnos y alumnas formados")).toBeInTheDocument();
    expect(screen.getByText("Asesoramientos personalizados")).toBeInTheDocument();
    expect(screen.getByText("Años de experiencia")).toBeInTheDocument();
    expect(screen.getByText("Años en mi herbolario")).toBeInTheDocument();
  });
});

describe("AboutMore", () => {
  it("renders all seven accordion items", () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(7);
  });

  it("renders the new cancer journey item", () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /camino del cáncer/i })).toBeInTheDocument();
  });

  it("Crear un espacio seguro is open by default", () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    const button = screen.getByRole("button", { name: /crear un espacio seguro/i });
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("expanded item shows body content", () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    expect(screen.getByText(/escucha activa y la confianza/)).toBeInTheDocument();
  });

  it("clicking a collapsed item expands it", async () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    const button = screen.getByRole("button", { name: /juventud sanitaria/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking the open item collapses it", async () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    const button = screen.getByRole("button", { name: /crear un espacio seguro/i });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("opening one item collapses the previously open item", async () => {
    render(<MemoryRouter><AboutMore /></MemoryRouter>);
    const espacio = screen.getByRole("button", { name: /crear un espacio seguro/i });
    const sanitaria = screen.getByRole("button", { name: /juventud sanitaria/i });
    expect(espacio).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(sanitaria);
    expect(espacio).toHaveAttribute("aria-expanded", "false");
    expect(sanitaria).toHaveAttribute("aria-expanded", "true");
  });
});
