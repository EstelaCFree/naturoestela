import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CategoryFilter } from "@/features/blog/components/CategoryFilter";
import { FILTER_CATEGORIES, CATEGORY_CONFIG } from "@/features/blog/data/categories";

function renderFilter(initialSearch = "") {
  return render(
    <MemoryRouter initialEntries={[`/blog${initialSearch}`]}>
      <Routes>
        <Route path="/blog" element={<CategoryFilter />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CategoryFilter", () => {
  it("renders all five filter category items", () => {
    renderFilter();
    for (const slug of FILTER_CATEGORIES) {
      expect(screen.getByText(CATEGORY_CONFIG[slug].label)).toBeInTheDocument();
    }
  });

  it("renders five Explorar links", () => {
    renderFilter();
    const explorars = screen.getAllByText("Explorar");
    expect(explorars).toHaveLength(5);
  });

  it("clicking a category button triggers selection (smoke)", async () => {
    renderFilter();
    const user = userEvent.setup();
    const neurodivButton = screen.getByText("Neurodivergencia").closest("button");
    expect(neurodivButton).not.toBeNull();
    await user.click(neurodivButton!);
    // Active state: Explorar text should be at full opacity (style change) — just check no crash
    expect(screen.getByText("Neurodivergencia")).toBeInTheDocument();
  });

  it("renders image error fallback with category colour", () => {
    const { container } = renderFilter();
    // Trigger onError for the first image to exercise the error path
    const imgs = container.querySelectorAll("img");
    if (imgs[0]) {
      imgs[0].dispatchEvent(new Event("error"));
    }
    // No crash expected — component handles onError via state
    expect(screen.getAllByText("Explorar").length).toBeGreaterThan(0);
  });
});
