import { describe, expect, it } from "vitest";
import { renderContent } from "@/features/blog/utils/renderContent";

describe("renderContent", () => {
  it("returns empty array for empty string", () => {
    expect(renderContent("")).toEqual([]);
  });

  it("classifies long paragraph ending with period as p", () => {
    const text = "Esto es un párrafo largo que termina con un punto y debe clasificarse como párrafo de texto normal.";
    const result = renderContent(text);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("p");
  });

  it("classifies short line without terminal punctuation as h3", () => {
    const text = "Lo que necesitas";
    const result = renderContent(text);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("h3");
  });

  it("handles multiple blocks correctly", () => {
    const text = "Título de sección\n\nEste es un párrafo largo con mucho texto que termina con punto.";
    const result = renderContent(text);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("h3");
    expect(result[1].type).toBe("p");
  });

  it("line ending with comma is treated as paragraph", () => {
    const result = renderContent("Alcohol, agua, aceite esencial,");
    expect(result[0].type).toBe("p");
  });

  it("preserves block text content", () => {
    const result = renderContent("Spray de menta: tu aliado refrescante");
    expect(result[0].text).toBe("Spray de menta: tu aliado refrescante");
  });
});
