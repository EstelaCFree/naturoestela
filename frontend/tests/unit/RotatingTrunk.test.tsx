import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RotatingTrunk } from "@/features/home/components/RotatingTrunk";

describe("RotatingTrunk", () => {
  it("renders all four rotating text labels", () => {
    render(<RotatingTrunk />);
    expect(screen.getByText(/\+500 personas han confiado en mí/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10 años de experiencia/i)).toBeInTheDocument();
    expect(screen.getByText(/Espacio seguro para neurodivergencias/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciencia \+ tradición/i)).toBeInTheDocument();
  });

  it("applies animate-spin-slow class to trunk image", () => {
    const { container } = render(<RotatingTrunk />);
    const img = container.querySelector("img");
    expect(img).toHaveClass("animate-spin-slow");
  });

  it("applies animate-spin-slow class to SVG wrapper", () => {
    const { container } = render(<RotatingTrunk />);
    const svgWrapper = container.querySelector(".animate-spin-slow:not(img)");
    expect(svgWrapper).toBeInTheDocument();
  });
});
